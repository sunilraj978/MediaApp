import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
  Storage,
} from "react-native-appwrite";
export const appwriteConfig = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.rn.aora",
  projectId: "671f3efb001f8528e594",
  dabaseId: "671f489900354b3a1d95",
  userCollectionId: "671f48db00065ad32001",
  videoCollectionId: "671f49100024f1198b42",
  storageId: "671f4ad40023fe03e2e8",
};

// Init your React Native SDK
const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint) // Your Appwrite Endpoint
  .setProject(appwriteConfig.projectId) // Your project ID
  .setPlatform(appwriteConfig.platform); // Your application ID or bundle ID.

const account = new Account(client);
const avatar = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);

export const createUser = async (email, password, username) => {
  try {
    const newAcc = await account.create(ID.unique(), email, password, username);

    if (!newAcc) throw Error;

    const avatarUrl = avatar.getInitials(username);

    await signIn(email, password);

    const newUser = await databases.createDocument(
      appwriteConfig.dabaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        accountId: newAcc.$id,
        email,
        username,
        avatar: avatarUrl,
      }
    );
    return newUser;
  } catch (error) {
    console.log(error);
  }
};

export const signIn = async (email, password) => {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    return session;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();

    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      appwriteConfig.dabaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
  }
};

export const getAllPost = async () => {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.dabaseId,
      appwriteConfig.videoCollectionId,
      [Query.orderDesc('$createdAt')]
    );

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
};

export const getLatestPosts = async () => {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.dabaseId,
      appwriteConfig.videoCollectionId,
      [Query.orderDesc("$createdAt"), Query.limit(7)]
    );
    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
};

export const searchPost = async (query) => {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.dabaseId,
      appwriteConfig.videoCollectionId,
      [Query.search("title", query)]
    );
    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
};

export const fetchPostById = async (userId) => {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.dabaseId,
      appwriteConfig.videoCollectionId,
      [Query.equal("creator", userId)]
    );
    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
};

export const signOut = async () => {
  try {
    const session = await account.deleteSession("current");
    return session;
  } catch (error) {
    console.log(error.message);
  }
};

export async function getFilePreview(fileId, type) {
  let fileUrl;

  try {
    if (type === "video") {
      fileUrl = storage.getFileView(appwriteConfig.storageId, fileId);
    } else if (type === "image") {
      fileUrl = storage.getFilePreview(
        appwriteConfig.storageId,
        fileId,
        2000,
        2000,
        "top",
        100
      );
    } else {
      throw new Error("Invalid file type");
    }

    if (!fileUrl) throw Error;

    return fileUrl;
  } catch (error) {
    throw new Error(error);
  }
}

export const uploadFile = async (file, type) => {
  if (!file) return;
  
  const asset = {
    name : file.fileName,
    type : file.mimeType,
    size : file.fileSize,
    uri  : file.uri
  }

  try {
    const uploadFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      asset
    );

    const filePre = await getFilePreview(uploadFile.$id, type);
    return filePre;
  } catch (error) {
    throw new Error(error);
  }
};


export const createVideo = async(form) =>{
  try{
    const [thumbnailUrl, videoUrl] = await Promise.all([
      uploadFile(form.thumbnail, 'image'),
      uploadFile(form.video, 'video'),
    ])
    const newPost = await databases.createDocument(
      appwriteConfig.dabaseId,
      appwriteConfig.videoCollectionId,
      ID.unique(), {
        title: form.title,
        thumbnail: thumbnailUrl,
        video : videoUrl,
        prompt : form.prompt,
        creator : form.userId
      }
    )
    return newPost;
  }
  catch(error){
    console.log(error.message)
  }
}