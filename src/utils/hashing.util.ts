import * as argon2 from 'argon2';

export async function hashPassword(password: string): Promise<string> {
  try {
    return await argon2.hash(password);
  } catch (err) {
    console.error(err);
    throw new Error('Can not hash password.');
  }
}

export async function verifyPassword(
  hash: string,
  password: string,
): Promise<boolean> {
  try {
    return await argon2.verify(hash, password);
  } catch (err) {
    console.error(err);
    return false;
  }
}
