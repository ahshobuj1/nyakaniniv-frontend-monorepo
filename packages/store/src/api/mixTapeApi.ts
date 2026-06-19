import { baseApi } from './baseApi';
import { MixTape, BaseResponse, CreateMixTapeRequest, UpdateMixTapeRequest, ReorderMixTapesRequest } from '../types';

export const mixTapeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyMixTapes: builder.query<BaseResponse<MixTape[]>, void>({
      query: () => ({
        url: '/mixtapes/v1/',
        method: 'GET',
      }),
      providesTags: ['MixTape'],
    }),
    createMixTape: builder.mutation<BaseResponse<MixTape>, CreateMixTapeRequest>({
      query: (body) => {
        const formData = new FormData();
        formData.append('title', body.title);
        if (body.audioUrl) formData.append('audioUrl', body.audioUrl);
        if (body.coverImage) formData.append('coverImage', body.coverImage);

        return {
          url: '/mixtapes/v1/',
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: ['MixTape'],
    }),
    updateMixTape: builder.mutation<BaseResponse<MixTape>, UpdateMixTapeRequest>({
      query: (body) => {
        const { id, ...rest } = body;
        const formData = new FormData();
        if (rest.title) formData.append('title', rest.title);
        if (rest.audioUrl) formData.append('audioUrl', rest.audioUrl);
        if (rest.coverImage) formData.append('coverImage', rest.coverImage);

        return {
          url: `/mixtapes/v1/${id}`,
          method: 'PATCH',
          body: formData,
        };
      },
      invalidatesTags: ['MixTape'],
    }),
    deleteMixTape: builder.mutation<BaseResponse<null>, string>({
      query: (id) => ({
        url: `/mixtapes/v1/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['MixTape'],
    }),
    reorderMixTapes: builder.mutation<BaseResponse<null>, ReorderMixTapesRequest>({
      query: (body) => ({
        url: '/mixtapes/v1/reorder',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['MixTape'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetMyMixTapesQuery,
  useCreateMixTapeMutation,
  useUpdateMixTapeMutation,
  useDeleteMixTapeMutation,
  useReorderMixTapesMutation,
} = mixTapeApi;
