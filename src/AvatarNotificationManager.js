/*jslint plusplus: true, white: true, browser: true */
/*global CvPlsHelper, $ */

(function() {

  'use strict';

  CvPlsHelper.AvatarNotificationManager = function(document, notificationStack, notificationDisplayFactory, pluginSettings) {
    this.document = document;
    this.notificationStack = notificationStack;
    this.notificationDisplay = notificationDisplayFactory.create(this);
    this.pluginSettings = pluginSettings;
  };

  // Adds a post to the queue
  CvPlsHelper.AvatarNotificationManager.prototype.enqueue = function(post) {
    var self = this;
    this.notificationStack.push(post);
    post.element.querySelector('a.cvhelper-question-link').addEventListener('click', function() {
      self.notificationStack.remove(post);
    });
    this.updateNotificationDisplay();
  };

  // Removes a post from the queue by post ID
  CvPlsHelper.AvatarNotificationManager.prototype.dequeue = function(idOrPost) {
    var post;
    if (typeof idOrPost === 'number') {
      post = this.notificationStack.match('postId', idOrPost);
    } else if (typeof idOrPost === 'object') {
      post = idOrPost;
    }
    if (post) {
      this.notificationStack.remove(post);
      this.updateNotificationDisplay();
    }
  };

  // Checks that all posts in the queue are still on the DOM
  CvPlsHelper.AvatarNotificationManager.prototype.reconcileQueue = function() {
    var document = this.document;
    this.notificationStack.forEach(function(post) {
      if (document.getElementById('message-'+post.postId) === null) {
        this.remove(post);
      }
    });

    this.updateNotificationDisplay();
  };

  CvPlsHelper.AvatarNotificationManager.prototype.updateNotificationDisplay = function() {
    this.notificationDisplay.update(this.notificationStack.length());
  };

  // Moves the screen to the last cv request on the stack (click handler for notification box)
  CvPlsHelper.AvatarNotificationManager.prototype.navigateToLastRequest = function() {
    var post = this.notificationStack.pop();
    if (post) {
      post.scrollTo();
      this.updateNotificationDisplay();
    }
  };

}());