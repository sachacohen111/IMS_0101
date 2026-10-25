/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { IMSProvider } from './context/IMSContext';
import { TuitionProApp } from './components/tuitionpro/TuitionProApp';

export default function App() {
  return (
    <IMSProvider>
      <div className="min-h-screen bg-[#f2f5f4] dark:bg-[#101615] text-[#17211f] dark:text-[#e6efed] flex flex-col font-sans transition-colors duration-200">
        <TuitionProApp />
      </div>
    </IMSProvider>
  );
}
