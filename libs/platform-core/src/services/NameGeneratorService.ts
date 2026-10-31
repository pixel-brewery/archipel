// #region Imports

import { Injectable } from '@nestjs/common';
import { randomBytes, randomInt } from 'node:crypto';

// #endregion

/**
 * Service for generating random names.
 *
 * @public
 */
@Injectable()
export class NameGeneratorService {
    // #region Fields

    private readonly _adjectives: Array<string> = [
        'Brave',
        'Clever',
        'Curious',
        'Daring',
        'Eager',
        'Fancy',
        'Glowing',
        'Happy',
        'Joyful',
        'Keen',
        'Lively',
        'Mighty',
        'Noble',
        'Proud',
        'Quiet',
        'Radiant',
        'Shiny',
        'Swift',
        'Tidy',
        'Vivid',
        'Wise',
        'Zesty',
    ];
    private readonly _nouns: Array<string> = [
        'Tiger',
        'Phoenix',
        'Unicorn',
        'Eagle',
        'Dragon',
        'Lion',
        'Panther',
        'Falcon',
        'Bear',
        'Wolf',
        'Shark',
        'Cheetah',
        'Owl',
        'Gorilla',
        'Leopard',
        'Penguin',
        'Rhino',
        'Serpent',
        'Turtle',
        'Whale',
        'Yak',
        'Zebra',
    ];

    // #endregion

    // #region Methods

    /**
     * Generates a random name.
     *
     * @public
     * @param useNumbers - If true, adds random numbers at the end of the name
     * @returns A randomly generated name
     */
    public generate(useNumbers = true): string {
        const adjective = this.getRandomElement(this._adjectives);
        const noun = this.getRandomElement(this._nouns);
        const randomNumbers = useNumbers ? this.getRandomNumbers(3) : '';
        return `${adjective}${noun}${randomNumbers}`;
    }

    /**
     * Generates a random name using secure random bytes.
     *
     * @public
     * @returns A cryptographically secure random name
     */
    public generateSecure(): string {
        const adjective = this.getRandomElement(this._adjectives);
        const noun = this.getRandomElement(this._nouns);
        const randomNumbers = randomBytes(2).toString('hex'); // Generates random hex numbers
        return `${adjective}${noun}${randomNumbers}`;
    }

    /**
     * Retrieves a random element from an array.
     *
     * @private
     * @param array - The array to pick a random element from
     * @returns A random element from the array
     */
    private getRandomElement(array: Array<string>): string {
        const randomIndex = randomInt(array.length);
        return array[randomIndex];
    }

    /**
     * Generates a random number of the specified length.
     *
     * @private
     * @param length - The number of digits to generate
     * @returns A string of random numbers
     */
    private getRandomNumbers(length: number): string {
        const max = 10 ** length;
        const randomNumber = randomInt(max);
        return randomNumber.toString().padStart(length, '0');
    }

    // #endregion
}
