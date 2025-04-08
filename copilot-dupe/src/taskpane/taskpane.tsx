/*
 * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

/* global document, Office */

Office.onReady(() => {
  // Get the root element
  const container = document.getElementById('root');
  if (!container) {
    throw new Error('Root element not found');
  }

  // Create a root for React
  const root = createRoot(container);

  // Render the app
  root.render(<App />);
});

export async function run() {
  return Word.run(async (context) => {
    /**
     * Insert your Word code here
     */

    // insert a paragraph at the end of the document.
    const paragraph = context.document.body.insertParagraph("Hello World", Word.InsertLocation.end);

    // change the paragraph color to blue.
    paragraph.font.color = "blue";

    await context.sync();
  });
}
