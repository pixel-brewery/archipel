// One-entry, production-ready wrapper around class-transformer focused on
// plain objects that contain ARRAY PROPERTIES (no “deep array of arrays” needed).
// Exposes exactly ONE public method: `UniversalTransformer.publicTransform(...)`.
//
// It transforms:
// - plain objects -> target class instances
// - class instances (same/different class) -> target class instances
// - array PROPERTIES inside those objects -> arrays of the desired element class
// - root-level arrays (T[]) are also supported for convenience
//
// Notes:
// - class-transformer cannot infer array *element* types without @Type(() => X).
//   To be fully generic “without compromises”, you can pass `hints` describing which
//   properties are arrays of which element class (and/or which properties are nested objects).
// - If your DTOs already use @Type decorators correctly, you usually don’t need hints.
//   This utility still works and protects you from the “empty array on nested arrays” edge cases
//   by never piping an array directly into plainToInstance for element conversion.
//
// Usage:
//   const dto = UniversalTransformer.publicTransform(RecipeDto, plain, {
//     hints: {
//       arrayElementTypes: { ingredients: IngredientDto }
//     }
//   });

import { ClassConstructor, ClassTransformOptions, instanceToInstance, instanceToPlain, plainToInstance } from 'class-transformer';
import { MaybeNullish } from '../types/MaybeNullish.js';

/**
 * Hints to guide transformation when @Type decorators are missing or incomplete.
 * - `arrayElementTypes`: for properties that are arrays: specify the element class.
 * - `propertyTypes`: for non-array nested object properties: specify the class.
 * - `nested`: provide further hints for nested properties (objects or array elements).
 */
export interface TransformHints<TTarget = unknown> {
    arrayElementTypes?: Partial<Record<keyof TTarget & string, ClassConstructor<unknown>>>;
    propertyTypes?: Partial<Record<keyof TTarget & string, ClassConstructor<unknown>>>;
    nested?: Partial<Record<keyof TTarget & string, TransformHints<unknown>>>;
}

/** Options merging class-transformer options with optional hints */
export interface UniversalTransformOptions extends ClassTransformOptions {
    hints?: TransformHints<unknown>;
}

/** Project-wide defaults; tweak as needed */
export const DEFAULT_CT_OPTIONS: ClassTransformOptions = {
    enableImplicitConversion: true,
    // If you rely on @Expose on DTOs, consider:
    // excludeExtraneousValues: true,
    // exposeUnsetFields: true,
};

export class ResponseTransformer {
    /**
     * Safely transform any input (plain or instance, with array properties) to the given target class.
     * Preserves the original array shape for properties, and can fix array element types using hints.
     *
     * @typeParam TTarget - Target class type
     * @typeParam TIn - Input element type (plain or instance)
     * @param target - Target class constructor
     * @param input  - Single object or an array of objects (root-level array allowed)
     * @param options - class-transformer options + optional `hints`
     * @returns Transformed instance or array of instances
     */
    public static transform<TTarget, TIn>(
        target: ClassConstructor<TTarget>,
        input: MaybeNullish<TIn | TIn[]>,
        options?: UniversalTransformOptions,
    ): MaybeNullish<TTarget | TTarget[]> {
        if (input == null) return input as MaybeNullish<TTarget | TTarget[]>;
        if (Array.isArray(input)) {
            // Root-level array: transform element-by-element
            return (input as TIn[]).map((item) => this.transformOne(target, item, options));
        }
        // Single object / instance
        return this.transformOne(target, input as TIn, options);
    }

    private static mergeOptions(options?: UniversalTransformOptions): UniversalTransformOptions {
        return {
            ...(DEFAULT_CT_OPTIONS as UniversalTransformOptions),
            ...(options ?? {}),
        };
    }

    private static isPrimitive(value: unknown): value is string | number | boolean | symbol | bigint | null | undefined {
        const t = typeof value;
        return value == null || t === 'string' || t === 'number' || t === 'boolean' || t === 'symbol' || t === 'bigint';
    }

    private static isDate(value: unknown): value is Date {
        return value instanceof Date;
    }

    private static isArray(value: unknown): value is unknown[] {
        return Array.isArray(value);
    }

    /** Cheap plain-object check (not array/date/class instance) */
    private static isPlainObject(value: unknown): value is Record<string, unknown> {
        if (value === null || typeof value !== 'object' || this.isArray(value) || this.isDate(value)) return false;
        const proto = Object.getPrototypeOf(value);
        return proto === Object.prototype || proto === null;
    }

    /** True for objects whose prototype isn't plain and not array/date => likely a class instance */
    private static isClassInstance(value: unknown): boolean {
        if (value === null || typeof value !== 'object') return false;
        if (this.isArray(value) || this.isDate(value)) return false;
        return !this.isPlainObject(value);
    }

    /** Safe instanceof (bundle boundaries can make instanceof flaky) */
    private static isInstanceOf<T>(value: unknown, ctor: ClassConstructor<T>): value is T {
        try {
            return value instanceof (ctor as unknown as new (...args: unknown[]) => unknown);
        } catch {
            return false;
        }
    }

    /** Transform a single non-array value to a target instance */
    private static toTargetInstance<TTarget, TIn>(target: ClassConstructor<TTarget>, input: TIn, options?: UniversalTransformOptions): TTarget {
        const opts = this.mergeOptions(options);

        if (input == null) return input as unknown as TTarget;
        if (this.isPrimitive(input) || this.isDate(input)) return input as unknown as TTarget;

        // Already the correct instance → clone/normalize via instanceToInstance to honor decorators
        if (this.isInstanceOf(input, target)) {
            return instanceToInstance(input, opts);
        }

        // Other class instance → normalize to plain first
        if (this.isClassInstance(input)) {
            const plain = instanceToPlain(input, opts);
            return plainToInstance(target, plain as object, opts);
        }

        // Plain object → straight to target
        if (this.isPlainObject(input)) {
            return plainToInstance(target, input as object, opts);
        }

        // Fallback pass-through (rare)
        return input as unknown as TTarget;
    }

    /**
     * Core single-object transform with post-fixup for array/object properties using hints.
     * This is where we ensure that plain object properties that are arrays become arrays of
     * the desired class instances (if hints or decorators exist).
     */
    private static transformOne<TTarget, TIn>(target: ClassConstructor<TTarget>, input: TIn, options?: UniversalTransformOptions): TTarget {
        const merged = this.mergeOptions(options);

        // First, transform the root to the target (lets class-transformer apply decorators if present)
        const root = this.toTargetInstance(target, input, merged);

        // Then, recursively fix array properties and nested object properties based on hints
        if (merged.hints) {
            this.applyHintsToObject(root as Record<string, unknown>, merged.hints, merged);
        }

        return root;
    }

    /**
     * Apply hints to a (already transformed) object:
     * - arrayElementTypes: convert each array item to its element ctor
     * - propertyTypes: convert nested object to its ctor
     * - nested: apply nested hints recursively
     */
    private static applyHintsToObject(obj: Record<string, unknown>, hints: TransformHints<unknown>, options: UniversalTransformOptions): void {
        if (!obj || typeof obj !== 'object') return;

        const { arrayElementTypes, propertyTypes, nested } = hints;

        // 1) Fix array properties
        if (arrayElementTypes) {
            for (const key of Object.keys(arrayElementTypes)) {
                const arrCtor = (arrayElementTypes as Record<string, ClassConstructor<unknown> | undefined>)[key];
                if (!arrCtor) continue;

                const val = obj[key];
                if (Array.isArray(val)) {
                    const childHints = nested ? (nested as Record<string, TransformHints<unknown> | undefined>)[key] : undefined;
                    obj[key] = val.map((item: unknown) => this.transformElementWithNested(arrCtor, item, childHints, options));
                }
            }
        }

        // 2) Fix nested non-array object properties
        if (propertyTypes) {
            for (const key of Object.keys(propertyTypes)) {
                const propCtor = (propertyTypes as Record<string, ClassConstructor<unknown> | undefined>)[key];
                if (!propCtor) continue;

                const val = obj[key];
                if (val && typeof val === 'object' && !Array.isArray(val)) {
                    const transformed = this.toTargetInstance(propCtor, val, options);
                    obj[key] = transformed;

                    // Apply nested hints if present
                    const childHints = nested ? (nested as Record<string, TransformHints<unknown> | undefined>)[key] : undefined;
                    if (childHints) {
                        this.applyHintsToObject(transformed as Record<string, unknown>, childHints, options);
                    }
                }
            }
        }

        // 3) If there are nested hints for keys we didn't explicitly transform above,
        //    we still try to descend if the shapes are objects/arrays.
        if (nested) {
            for (const key of Object.keys(nested)) {
                const sub = obj[key];
                const childHints = (nested as Record<string, TransformHints<unknown> | undefined>)[key];
                if (!childHints) continue;

                if (Array.isArray(sub)) {
                    obj[key] = sub.map((item: unknown) => {
                        if (item && typeof item === 'object' && !Array.isArray(item)) {
                            this.applyHintsToObject(item as Record<string, unknown>, childHints, options);
                        }
                        return item;
                    });
                } else if (sub && typeof sub === 'object') {
                    this.applyHintsToObject(sub as Record<string, unknown>, childHints, options);
                }
            }
        }
    }

    /** Helper: transform an array element to ctor, then apply nested hints (if given). */
    private static transformElementWithNested<T>(
        ctor: ClassConstructor<T>,
        item: unknown,
        childHints: TransformHints<unknown> | undefined,
        options: UniversalTransformOptions,
    ): T {
        const inst = this.toTargetInstance(ctor, item, options);
        if (childHints) {
            this.applyHintsToObject(inst as Record<string, unknown>, childHints, options);
        }
        return inst;
    }
}
