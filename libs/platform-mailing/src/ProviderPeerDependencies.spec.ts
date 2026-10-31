import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

interface IPackageManifest {
    readonly peerDependencies?: Readonly<Record<string, string>>;
    readonly peerDependenciesMeta?: Readonly<Record<string, { readonly optional?: boolean }>>;
}

const OPTIONAL_PROVIDER_PEERS = ['@sendgrid/mail', 'form-data', 'mailgun.js', 'postmark', 'resend'] as const;

describe('mailing provider peer dependencies', () => {
    it('should keep opt-in delivery provider packages optional', () => {
        // arrange
        const packageManifest = JSON.parse(readFileSync(resolve(import.meta.dirname, '../package.json'), 'utf8')) as IPackageManifest;

        // act
        const violations = OPTIONAL_PROVIDER_PEERS.filter(
            (dependency) =>
                packageManifest.peerDependencies?.[dependency] === undefined || packageManifest.peerDependenciesMeta?.[dependency]?.optional !== true,
        );

        // assert
        expect(violations).toEqual([]);
    });

    it('should keep the root-level SMTP dependency required', () => {
        // arrange
        const packageManifest = JSON.parse(readFileSync(resolve(import.meta.dirname, '../package.json'), 'utf8')) as IPackageManifest;

        // act
        const isRequired =
            packageManifest.peerDependencies?.['nodemailer'] !== undefined && packageManifest.peerDependenciesMeta?.['nodemailer']?.optional !== true;

        // assert
        expect(isRequired).toBe(true);
    });
});
