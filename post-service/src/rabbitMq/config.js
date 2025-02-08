"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postServiceProducers = exports.postServiceConsumers = exports.MQActions = exports.MQExchangeName = void 0;
exports.MQExchangeName = "wenet_exchange";
exports.MQActions = {
    addUser: "createUser",
    editUser: "updateUser",
    addNotification: "createNotification",
    addPost: "createPost",
    editPost: "updatePost",
    addComment: "createComment",
    editComment: "updateComment",
    addWeNetAd: "createWeNetAd",
};
exports.postServiceConsumers = [
    { queueName: "user-post", routingKey: "wenet-user-post-key" },
    { queueName: "ads-post", routingKey: "wenet-ads-post-key" },
];
exports.postServiceProducers = ["wenet-post-ads-key", "wenet-post-notification-key"]; //routing keys 
