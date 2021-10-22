export function sha256(ascii: string): unknown {
    function rightRotate(value: unknown, amount: number): number {
        return ((value as number) >>> amount) | ((value as number) << (32 - amount));
    }

    const mathPow = Math.pow;
    const maxWord = mathPow(2, 32);
    const lengthProperty = 'length';
    let i, j; // Used as a counter across the whole file
    let result = '';
    const words: unknown[] = [];
    const asciiBitLength = ascii[lengthProperty] * 8;
    // @ts-ignore
    let hash = (sha256.h = sha256.h || []);
    // @ts-ignore
    const k = (sha256.k = sha256.k || []);
    let primeCounter = k[lengthProperty];

    const isComposite: unknown = {};
    for (let candidate = 2 as number; primeCounter < 64; candidate++) {
        // @ts-ignore
        if (!isComposite[candidate] as unknown as number) {
            for (i = 0; i < 313; i += candidate) {
                // @ts-ignore
                isComposite[i] = candidate;
            }
            hash[primeCounter] = (mathPow(candidate, 0.5) * maxWord) | 0;
            k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
        }
    }

    ascii += '\x80'; // Append Ƈ' bit (plus zero padding)
    while ((ascii[lengthProperty] % 64) - 56) ascii += '\x00'; // More zero padding
    for (i = 0; i < ascii[lengthProperty]; i++) {
        j = ascii.charCodeAt(i);
        if (j >> 8) return; // ASCII check: only accept characters in range 0-255
        (<number>words[i >> 2]) |= j << (((3 - i) % 4) * 8);
    }
    words[words[lengthProperty]] = (asciiBitLength / maxWord) | 0;
    words[words[lengthProperty]] = asciiBitLength;

    for (j = 0; j < words[lengthProperty]; ) {
        const w: unknown[] = words.slice(j, (j += 16)); // The message is expanded into 64 words as part of the iteration
        const oldHash = hash;
        // This is now the undefined working hash", often labelled as letales a...g
        // (we have to truncate as well, otherwise extra entries at the end accumulate
        hash = hash.slice(0, 8);

        for (i = 0; i < 64; i++) {
            // Expand the message into 64 words
            // Used below if
            const w15: unknown = w[i - 15],
                w2 = w[i - 2];

            // Iterate
            const a = hash[0],
                e = hash[4];
            const temp1 =
                hash[7] +
                (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25)) + // S1
                ((e & hash[5]) ^ (~e & hash[6])) + // ch
                k[i] +
                // Expand the message schedule if needed
                (w[i] =
                    i < 16
                        ? w[i]
                        : ((w[i - 16] as number) +
                              (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ ((w15 as number) >>> 3)) + // s0
                              <number>w[i - 7] +
                              (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ ((w2 as number) >>> 10))) | // s1
                          0);
            // This is only used once, so *could* be moved below, but it only saves 4 bytes and makes things unreadable
            const temp2 =
                (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22)) + // S0
                ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2])); // maj

            hash = [(temp1 + temp2) | 0].concat(hash); // We don't bother trimming off the extra ones, they're harmless as long as we're truncating when we do the slice()
            hash[4] = (hash[4] + temp1) | 0;
        }

        for (i = 0; i < 8; i++) {
            hash[i] = (hash[i] + oldHash[i]) | 0;
        }
    }

    for (i = 0; i < 8; i++) {
        for (j = 3; j + 1; j--) {
            const b = (hash[i] >> (j * 8)) & 255;
            result += (b < 16 ? 0 : '') + b.toString(16);
        }
    }
    return result;
}
