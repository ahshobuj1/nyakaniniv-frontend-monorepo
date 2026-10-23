import { baseApi } from './baseApi';
import { 
  Tenant, 
  BaseResponse, 
  OnboardTenantRequest, 
  UpdateTenantProfileRequest, 
  AssignThemeRequest 
} from '../types';

export const tenantApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    onboardTenant: builder.mutation<BaseResponse<Tenant>, OnboardTenantRequest>({
      query: (body) => ({
        url: '/tenant/v1/onboard',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Tenant', 'User'],
    }),
    getPublicProfile: builder.query<BaseResponse<Tenant>, string>({
      query: (subdomain) => ({
        url: `/tenant/v1/${subdomain}`,
        method: 'GET',
      }),
      providesTags: ['Tenant'],
    }),
    updateTenantProfile: builder.mutation<BaseResponse<Tenant>, UpdateTenantProfileRequest>({
      query: (body) => {
        // Handle potential file uploads
        let requestBody: any = body;

        if (body.logo || body.banner) {
          const formData = new FormData();
          if (body.stageName) formData.append('stageName', body.stageName);
          if (body.country) formData.append('country', body.country);
          if (body.city) formData.append('city', body.city);
          if (body.genres) {
            body.genres.forEach(genre => formData.append('genres[]', genre));
          }
          if (body.bio) formData.append('bio', body.bio);
          if (body.socialLinks) formData.append('socialLinks', JSON.stringify(body.socialLinks));
          if (body.logo) formData.append('logo', body.logo);
          if (body.banner) formData.append('banner', body.banner);
          requestBody = formData;
        }

        return {
          url: '/tenant/v1/profile',
          method: 'PUT',
          body: requestBody,
        };
      },
      invalidatesTags: ['Tenant', 'User'],
    }),
    assignTheme: builder.mutation<BaseResponse<Tenant>, AssignThemeRequest>({
      query: (body) => ({
        url: '/tenant/v1/theme',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Tenant', 'User'],
    }),
    uploadTenantMedia: builder.mutation<BaseResponse<{ url: string }>, File>({
      query: (file) => {
        const formData = new FormData();
        formData.append('file', file);
        return {
          url: '/tenant/v1/upload-media',
          method: 'POST',
          body: formData,
        };
      },
    }),
    getPaymentInstructions: builder.query<BaseResponse<Record<string, any> | null>, void>({
      query: () => ({
        url: '/tenant/v1/payment-instructions',
        method: 'GET',
      }),
      providesTags: ['Tenant'],
    }),
    updatePaymentInstructions: builder.mutation<BaseResponse<Record<string, any>>, Record<string, any>>({
      query: (body) => ({
        url: '/tenant/v1/payment-instructions',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Tenant'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useOnboardTenantMutation,
  useGetPublicProfileQuery,
  useUpdateTenantProfileMutation,
  useAssignThemeMutation,
  useUploadTenantMediaMutation,
  useGetPaymentInstructionsQuery,
  useUpdatePaymentInstructionsMutation,
} = tenantApi;

