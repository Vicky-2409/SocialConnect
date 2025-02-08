"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationServiceProducers = exports.notificationServiceConsumers = exports.MQActions = exports.MQExchangeName = void 0;
exports.MQExchangeName = "wenet_exchange";
exports.MQActions = {
    addUser: "createUser",
    editUser: "updateUser",
    addNotification: "createNotification",
    addPost: "createPost",
    editPost: "updatePost",
    addComment: "createComment",
    editComment: "updateComment",
};
exports.notificationServiceConsumers = [
    { queueName: "user-notification", routingKey: "wenet-user-notification-key" },
    { queueName: "post-notification", routingKey: "wenet-post-notification-key" },
];
exports.notificationServiceProducers = ['wenet-notification-message-key']; //routing keys 
