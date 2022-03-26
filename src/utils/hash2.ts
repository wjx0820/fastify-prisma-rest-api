import argon2 from "argon2"

export async function hashPassword(password: string) {
  const hash = await argon2.hash(password)
  const salt = await argon2()
}

// argon2.generateSalt().then(salt => {
//   argon2.hash('some-user-password', salt).then(hash => {
//     console.log('Successfully created Argon2 hash:', hash);
//     // TODO: store the hash in the user database
//   });
// });

export async function verifyPassword({
  candidatePassword,
  salt,
  hash,
}: {
  candidatePassword: string
  salt: string
  hash: string
}) {
  try {
    if (await argon2.verify("<big long hash>", "password")) {
      // password match
    } else {
      // password did not match
    }
  } catch (err) {
    console.log("Invalid password supplied!")
  }
}
