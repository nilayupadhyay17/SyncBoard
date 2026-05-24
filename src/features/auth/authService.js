import { account } from "@/lib/appwrite";

/**
 *
 *Register new user
 *
 */
export async function registerUesr({ email, password, name, phone }) {
  return await account.create({
    userId: "unique()",
    email: email,
    password: password,
    phone: phone,
    name: name,
  });
}

/**
 *
 *
 * Login user
 */
export async function loginUser({ email, password }) {
  return await account.createEmailPasswordSession({
    email,
    password,
  });
}

/**
 *
 *
 * logout user
 */

export async function logoutUser(sessionId) {
  console.log(sessionId);
  return await account.deleteSession({
    sessionId: "current",
  });
}

// get the current user info:
export async function getCurrentUser() {
  try {
    return await account.get();
  } catch (error) {
    console.log(error);
    return null;
  }
}
