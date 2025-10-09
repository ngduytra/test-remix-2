export type Env = 'development' | 'staging' | 'production'

const env: Env = (import.meta.env.VITE_ENV as Env) || 'development'

export default env
