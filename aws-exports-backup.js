const awsConfig = {
    aws_appsync_graphqlEndpoint: import.meta.env.VITE_APPSYNC_ENDPOINT,
    aws_appsync_region: import.meta.env.VITE_APPSYNC_REGION,
    aws_appsync_authenticationType: 'API_KEY', // or 'AMAZON_COGNITO_USER_POOLS' or 'AWS_IAM'
    aws_appsync_apiKey: import.meta.env.VITE_APPSYNC_API_KEY, // Only required if using API_KEY auth mode
    aws_project_region: import.meta.env.VITE_APPSYNC_REGION
};

export default awsConfig;
