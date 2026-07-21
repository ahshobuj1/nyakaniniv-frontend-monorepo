import { baseApi } from './baseApi';
import { LandingPageContent, BaseResponse } from '../types';

export const landingPageApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getLandingPageContent: builder.query<BaseResponse<LandingPageContent>, void>({
      query: () => ({
        url: '/landing-page/v1/content',
        method: 'GET',
      }),
      providesTags: ['LandingPage'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetLandingPageContentQuery,
} = landingPageApi;
