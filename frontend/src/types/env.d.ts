declare namespace NodeJS {
  interface ProcessEnv {
    // API URLs
    NEXT_PUBLIC_API_URL: string;
    NEXT_PUBLIC_API_URL_DEV: string;
    
    // CDN URLs
    NEXT_PUBLIC_CDN_URL: string;
    
    // Site information
    NEXT_PUBLIC_SITE_NAME: string;
    NEXT_PUBLIC_SITE_DESCRIPTION: string;
    
    // Default language
    NEXT_PUBLIC_DEFAULT_LANGUAGE: string;
    
    // SFTP Configuration
    NEXT_PUBLIC_SFTP_HOST: string;
    NEXT_PUBLIC_SFTP_PORT: string;
    NEXT_PUBLIC_SFTP_USERNAME: string;
  }
}
