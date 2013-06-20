/* Copyright (c) 2010, Sage Software, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Utility provides functions that are more javascript enhancers than application related code.
 * @alternateClassName utility
 * @singleton
 */
define('Mobile/SalesLogix/Utility', [
    'dojo/_base/lang',
    'dojo/string',
    'dojo/has',
    'dojo/_base/sniff',
    'dojox/mobile/sniff'
], function(
    lang,
    string,
    has,
    baseSniff,
    mobileSniff
) {
    return lang.setObject('Mobile.SalesLogix.Utility', {
        base64ArrayBuffer: function (arrayBuffer) {
            var base64    = ''
            var encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'

            var bytes         = new Uint8Array(arrayBuffer)
            var byteLength    = bytes.byteLength
            var byteRemainder = byteLength % 3
            var mainLength    = byteLength - byteRemainder

            var a, b, c, d
            var chunk

            // Main loop deals with bytes in chunks of 3
            for (var i = 0; i < mainLength; i = i + 3) {
                // Combine the three bytes into a single integer
                chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2]

                // Use bitmasks to extract 6-bit segments from the triplet
                a = (chunk & 16515072) >> 18 // 16515072 = (2^6 - 1) << 18
                b = (chunk & 258048)   >> 12 // 258048   = (2^6 - 1) << 12
                c = (chunk & 4032)     >>  6 // 4032     = (2^6 - 1) << 6
                d = chunk & 63               // 63       = 2^6 - 1

                // Convert the raw binary segments to the appropriate ASCII encoding
                base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d]
            }

            // Deal with the remaining bytes and padding
            if (byteRemainder == 1) {
                chunk = bytes[mainLength]

                a = (chunk & 252) >> 2 // 252 = (2^6 - 1) << 2

                // Set the 4 least significant bits to zero
                b = (chunk & 3)   << 4 // 3   = 2^2 - 1

                base64 += encodings[a] + encodings[b] + '=='
            } else if (byteRemainder == 2) {
                chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1]

                a = (chunk & 64512) >> 10 // 64512 = (2^6 - 1) << 10
                b = (chunk & 1008)  >>  4 // 1008  = (2^6 - 1) << 4

                // Set the 2 least significant bits to zero
                c = (chunk & 15)    <<  2 // 15    = 2^4 - 1

                base64 += encodings[a] + encodings[b] + encodings[c] + '='
            }

            return base64
        },
        getFileExtension: function(fileName) {
            if (!fileName){
                return '.';
            }
            return fileName.substr(fileName.lastIndexOf('.'));
        }
    });
});

