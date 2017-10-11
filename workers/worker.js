/* Copyright 2017 Infor
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

if (!self.indexedDB) {
  // self.postMessage('IndexedDB not supported in this worker.');
  throw new Error('IndexedDB not supported in worker.');
  self.close();
}

self.onmessage = function onMessage(e) {
  console.log('Message recieved in worker.js');
  console.dir(e);

  self.postMessage('Something');
  console.dir(self);
};
