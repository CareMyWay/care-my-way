import { defineStorage } from "@aws-amplify/backend";

export const storage = defineStorage({
    name: "caremyway-storage",
    access: (allow) => ({
        // User profile photos - owner can manage, others can read
        "profile-photos/{entity_id}/*": [
            allow.entity("identity").to(["read", "write", "delete"]),
            allow.authenticated.to(["read"]),
            allow.guest.to(["read"])
        ],
        // User credentials - private, only owner can access
        "credentials/{entity_id}/*": [
            allow.entity("identity").to(["read", "write", "delete"])
        ]
    })
});

// JSON policy for the S3 bucket - Paste this into the 'production' bucket policy in the AWS console
// {
//     "Version": "2012-10-17",
//     "Statement": [
//         {
//             "Sid": "AllowUserToListBucket",
//             "Effect": "Allow",
//             "Action": [
//                 "s3:ListBucket"
//             ],
//             "Resource": "arn:aws:s3:::amplify-caremyway-ruski-s-caremywaystoragebucket9a-sftfnph1nxkl", // Bucket ARN - Change to production bucket ARN when deployed
//             "Condition": {
//                 "StringLike": {
//                     "s3:prefix": [
//                         "profile-photos/${cognito-identity.amazonaws.com:sub}/*",
//                         "credentials/${cognito-identity.amazonaws.com:sub}/*"
//                     ]
//                 }
//             }
//         },
//         {
//             "Sid": "AllowUserToAccessOwnProfilePhotos",
//             "Effect": "Allow",
//             "Action": [
//                 "s3:GetObject",
//                 "s3:PutObject",
//                 "s3:DeleteObject"
//             ],
//             "Resource": "arn:aws:s3:::amplify-caremyway-ruski-s-caremywaystoragebucket9a-sftfnph1nxkl/profile-photos/${cognito-identity.amazonaws.com:sub}/*" // Bucket ARN - Change to production bucket ARN when deployed
//         },
//         {
//             "Sid": "AllowUserToAccessOwnCredentials",
//             "Effect": "Allow",
//             "Action": [
//                 "s3:GetObject",
//                 "s3:PutObject",
//                 "s3:DeleteObject"
//             ],
//             "Resource": "arn:aws:s3:::amplify-caremyway-ruski-s-caremywaystoragebucket9a-sftfnph1nxkl/credentials/${cognito-identity.amazonaws.com:sub}/*" // Bucket ARN - Change to production bucket ARN when deployed
//         },
//         {
//             "Sid": "AllowReadAccessToAllProfilePhotos",
//             "Effect": "Allow",
//             "Action": [
//                 "s3:GetObject"
//             ],
//             "Resource": "arn:aws:s3:::amplify-caremyway-ruski-s-caremywaystoragebucket9a-sftfnph1nxkl/profile-photos/*/*" // Bucket ARN - Change to production bucket ARN when deployed
//         }
//     ]
// }
