import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
export class Message {
  constructor(public author: string, public content: string) {}
}
@Injectable()
export class ChatService {
  constructor() {}
  conversation = new Subject<Message[]>();
  messageMap = {
    'Hi': 'Hello',
    'How impactful is your portfolio?':
      'According to my Hygitus impact measurement report, very!',
    'How can I get better impact performance?':
      'The Hygitus knowledge hub should help you with that!',
    defaultmsg: "I don't understand. Please can you repeat",
  };
  getBotAnswer(msg: string) {
    const userMessage = new Message('user', msg);
    this.conversation.next([userMessage]);
    const botMessage = new Message('bot', this.getBotMessage(msg));
    setTimeout(() => {
      this.conversation.next([botMessage]);
    }, 2000);
  }
  getBotMessage(question: string) {
    let answer = this.messageMap[question as keyof typeof this.messageMap];
    return answer || this.messageMap['defaultmsg'];
  }
}
