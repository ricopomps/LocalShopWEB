import { Note } from "../models/note";
import { User, UserType } from "../models/user";
import { ProfileForm } from "../pages/ProfilePage";
import { getApi } from "./api";
//USER ROUTES

export async function getLoggedInUser(): Promise<User> {
  const response = await getApi().get("/api/users");
  return response.data;
}

export interface SignUpCredentials {
  username: string;
  email: string;
  password: string;
  userType: UserType;
  cpf: string;
  confirmedPassword: string;
}

export async function signUp(credentials: SignUpCredentials): Promise<User> {
  const { data } = await getApi().post("/api/users/signup", credentials);
  return data;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export async function login(credentials: LoginCredentials): Promise<User> {
  const {
    data: { user, accessToken },
  } = await getApi().post("/api/auth", credentials);
  sessionStorage.removeItem("token");
  sessionStorage.setItem("token", accessToken);
  return user;
}

export async function logout() {
  await getApi().post("/api/auth/logout");
  sessionStorage.removeItem("token");
}

export async function updateUser(user: ProfileForm) {
  const response = await getApi().patch("/api/users", user);
  return response.data;
}

//NOTES ROUTES
export async function fetchNotes(): Promise<Note[]> {
  const response = await getApi().get("/api/notes", { withCredentials: true });
  return response.data;
}

export interface NoteInput {
  title: string;
  text?: string;
}

export async function createNote(note: NoteInput): Promise<Note> {
  const response = await getApi().post("/api/notes", note);
  return response.data;
}

export async function updateNote(
  noteId: string,
  note: NoteInput
): Promise<Note> {
  const response = await getApi().patch(`/api/notes/${noteId}`, note);
  return response.data;
}

export async function deleteNote(noteId: string) {
  await getApi().delete(`/api/notes/${noteId}`);
}
