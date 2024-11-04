import { useEffect, useState } from "react";
import { Alert } from "react-native";

const useAppwrite = (fn) => {
  const [post, setPost] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAllPost = async () => {
    setIsLoading(true);
    try {
      const response = await fn();
      setPost(response);
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchAllPost();
  }, []);

  const refetch = () => fetchAllPost()

  return { post, isLoading, refetch };
};

export default useAppwrite;
