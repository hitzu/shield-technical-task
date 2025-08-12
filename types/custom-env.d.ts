declare module 'custom-env' {
  interface CustomEnvModule {
    env(environment?: string | boolean, path?: string): void;
  }

  const customEnv: CustomEnvModule;
  export default customEnv;
}
