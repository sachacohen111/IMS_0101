export interface CapacitorConfig {
  appId: string;
  appName: string;
  webDir: string;
  server?: {
    androidScheme?: string;
    cleartext?: boolean;
    url?: string;
  };
  android?: {
    buildOptions?: {
      keystorePath?: string;
      keystoreAlias?: string;
    };
  };
  plugins?: Record<string, any>;
}

const config: CapacitorConfig = {
  appId: 'com.ims.institute',
  appName: 'IMS Mobile',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1800,
      launchAutoHide: true,
      backgroundColor: '#0b1329',
      androidSplashResourceName: 'splash',
      showSpinner: true,
      spinnerColor: '#0f766e'
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#0b1329'
    }
  }
};

export default config;
