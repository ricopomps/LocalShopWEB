import { Note } from "../models/note";
import { User } from "../models/user";
import axios from "axios";
const { REACT_APP_API_BASE_URL: baseUrl } = process.env;

const API = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
});

//USER ROUTES

export async function getLoggedInUser(): Promise<User> {
  const response = await API.get("/api/users");
  return response.data;
}

export interface SignUpCredentials {
  username: string;
  email: string;
  password: string;
}

export async function signUp(credentials: SignUpCredentials): Promise<User> {
  const response = await API.post("/api/users/signup", credentials);
  return response.data;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export async function login(credentials: LoginCredentials): Promise<User> {
  const response = await API.post("/api/users/login", credentials);
  return response.data;
}

export async function logout() {
  await API.post("/api/users/logout");
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
