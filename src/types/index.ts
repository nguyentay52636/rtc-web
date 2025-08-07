import { User } from "@clerk/nextjs/server";

export interface SocketUser { 
    userId : string;
    socketId : string;
    profile : User;
 }
export interface OngoingCall  { 
    partcipants : Participants;
    createdAt : Date;
    updatedAt : Date;
}
export interface Participants { 
    caller : SocketUser;
    receiver : SocketUser;
}