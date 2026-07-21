import { baseApi } from './baseApi';
import { User, BaseResponse, UpdateProfileRequest } from '../types';

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCurrentProfile: builder.query<BaseResponse<User>, void>({
      query: () => ({
        url: '/users/v1/me',
        method: 'GET',
      }),
      providesTags: ['User'],
    }),
    updateCurrentProfile: builder.mutation<BaseResponse<User>, UpdateProfileRequest>({
      query: (body) => {
        // If there's a file, we need to use FormData
        let requestBody: any = body;
        
        if (body.profileImage && typeof body.profileImage !== 'string') {
          const formData = new FormData();
          if (body.firstName) formData.append('firstName', body.firstName);
          if (body.lastName) formData.append('lastName', body.lastName);
          formData.append('profileImage', body.profileImage);
          requestBody = formData;
        }

        return {
          url: '/users/v1/me',
          method: 'PATCH',
          body: requestBody,
        };
      },
      invalidatesTags: ['User'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetCurrentProfileQuery,
  useUpdateCurrentProfileMutation,
} = userApi;
