import { useState, useEffect } from "react";
import FetchService from "../fetchService";
import ApiEndpoints from "../ApiEndpoints";
import { User } from "../User";

const useUsers = () => {
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [users, seUsers] = useState<User[]>([]);

  const fetchUsers = async () => {
    setIsLoadingUsers(true);
    const { users } = await FetchService.request(ApiEndpoints.USERS_LIST);
    seUsers(users);
    setIsLoadingUsers(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);
  return { isLoadingUsers, users, fetchUsers };
};
export default useUsers;
