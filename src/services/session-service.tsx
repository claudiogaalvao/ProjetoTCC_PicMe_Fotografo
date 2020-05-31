import Session from "../models/firebase/session-model";
import { firestore } from "react-native-firebase";
import Collections from "../models/firebase/collections";

export default class SessionService {
  static save(session: Session) {
    return firestore().collection(Collections.SESSIONS).add(session);
  }

  static async getPhotographerSessions(photographerId: string) {
    const sessions = await firestore().collection(Collections.SESSIONS)
    .where('photographerId', '==', photographerId).get();

    if (!sessions) return 0;
    if (!sessions.docs) return 0;

    return sessions.docs.length;
  }

  static async getSessionInfo(photographerId: string, requesterId: string, seconds: number, nanoseconds: number) {
    const date = new firestore.Timestamp(seconds, nanoseconds)
    const sessions = await firestore().collection(Collections.SESSIONS)
    .where('photographerId', '==', photographerId)
    .where('requesterId', '==', requesterId)
    .where('date', '==', date)
    .get();

    if (!sessions) return 0;
    if (!sessions.docs) return 0;

    return sessions.docs;
  }
}