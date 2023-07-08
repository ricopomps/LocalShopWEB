import { Note } from "../models/note";
import { User, UserType } from "../models/user";
import { API } from "./api";
//USER ROUTES

export async function getLoggedInUser(): Promise<User> {
  const response = await API.get("/api/users");
  return response.data;
}

export interface SignUpCredentials {
  username: string;
  email: string;
  password: string;
  userType: UserType;
}

export async function signUp(credentials: SignUpCredentials): Promise<User> {
  const { data } = await API.post("/api/users/signup", credentials);
  sessionStorage.setItem("token", data);
  return data;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export async function login(credentials: LoginCredentials): Promise<User> {
  const {
    data: { user, accessToken },
  } = await API.post("/api/auth", credentials);
  console.log(accessToken);
  sessionStorage.removeItem("token");
  sessionStorage.setItem("token", accessToken);
  return user;
}

export async function logout() {
  await API.post("/api/auth/logout");
  sessionStorage.removeItem("token");
}

//NOTES ROUTES
export async function fetchNotes(): Promise<Note[]> {
  const response = await API.get("/api/notes", { withCredentials: true });
  return response.data;
}

export interface NoteInput {
  title: string;
  text?: string;
}

export async function createNote(note: NoteInput): Promise<Note> {
  const response = await API.post("/api/notes", note);
  return response.data;
}

export async function updateNote(
  noteId: string,
  note: NoteInput
): Promise<Note> {
  const response = await API.patch(`/api/notes/${noteId}`, note);
  return response.data;
}

export async function deleteNote(noteId: string) {
  await API.delete(`/api/notes/${noteId}`);
}
