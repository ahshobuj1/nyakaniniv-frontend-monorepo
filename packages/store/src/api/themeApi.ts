import { baseApi } from './baseApi';
import { Theme, BaseResponse } from '../types';

export const themeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllThemes: builder.query<BaseResponse<Theme[]>, void>({
      query: () => ({
        url: '/themes/v1/',
        method: 'GET',
      }),
      providesTags: ['Theme'],
    }),
    getThemeBySlug: builder.query<BaseResponse<Theme>, string>({
      query: (slug) => ({
        url: `/themes/v1/slug/${slug}`,
        method: 'GET',
      }),
      providesTags: (result, error, slug) => [{ type: 'Theme', id: slug }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAllThemesQuery,
  useGetThemeBySlugQuery,
} = themeApi;
