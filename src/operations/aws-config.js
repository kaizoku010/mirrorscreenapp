import AWS from 'aws-sdk';
import { CognitoUserPool, CognitoUser, CognitoUserAttribute, AuthenticationDetails} from 'amazon-cognito-identity-js';

AWS.config.update({
  region: 'us-east-1', 
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY
});
const s3 = new AWS.S3();
const dynamoDB = new AWS.DynamoDB.DocumentClient(
   { region: 'us-east-1', 
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY
    
});

const userPool = new CognitoUserPool({
  UserPoolId: 'ap-south-1_YRFnyDxCR', // Replace with your actual User Pool ID
  ClientId: '714k6vrn207tf567haia6ljvpg'
});

const awsmobile = {
  "aws_project_region": "ap-south-1",
  "aws_cognito_identity_pool_id":"ap-south-1:db49acfd-d32a-43b7-9b0a-684b9e77bfe9",
  "aws_cognito_region": "ap-south-1",
  "aws_user_pools_id": "ap-south-1_YRFnyDxCR",
  "aws_user_pools_web_client_id": "714k6vrn207tf567haia6ljvpg",
  "oauth": {}
};


export {awsmobile, s3, CognitoUser,dynamoDB,AuthenticationDetails,CognitoUserPool,userPool, CognitoUserAttribute};
