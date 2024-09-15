import ApiUtil from '../../../../utils/ApiUtils';
import { profileApiUrls } from '../../../../constant/ApiEndPoints';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import {
  setLoading,
  setProfileCount,
  setUserDetails,
} from '../../../../redux/reducer/authReducer';
import { localStorageKey } from '../../../../constant';

const useProfileComponentService = () => {
  const dispatch = useDispatch();
  const { userDetails } = useSelector((state) => state.authReducer);

  const getUserDetails = async () => {
    try {
      dispatch(setLoading(true));
      await ApiUtil.getData(profileApiUrls.user).then((res) => {
        localStorage.setItem(
          localStorageKey.userDetails,
          JSON.stringify(res.data),
        );
        dispatch(setUserDetails(res?.data));
        dispatch(setLoading(false));
      });
    } catch (error) {
      dispatch(setLoading(false));
      console.log(error);
    }
  };

  const getProfilePicture = async () => {
    const url = userDetails?.profile_pic_key?.split('/');
    const result = await ApiUtil.getData(
      `${profileApiUrls.image}/${url[1]}`,
    ).then((res) => {
      return res.data;
    });
    return result;
  };

  const saveProfileImage = async (imgCrop) => {
    await ApiUtil.postData(`${profileApiUrls.profilePicture}`, {
      image_file: imgCrop,
    })
      .then(() => {
        getUserDetails();
        dispatch(setLoading(false));
        dispatch(setProfileCount());
      })
      .catch(() => {
        dispatch(setLoading(false));
      });
  };

  const saveProfileData = async (data) => {
    await ApiUtil.putData(`${profileApiUrls.user}`, data)
      .then(() => {
        getUserDetails();
        dispatch(setLoading(false));
      })
      .catch(() => {
        dispatch(setLoading(false));
      });
  };
  return {
    getUserDetails,
    getProfilePicture,
    saveProfileImage,
    saveProfileData,
  };
};

export default useProfileComponentService;
