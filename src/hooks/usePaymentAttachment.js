import useSWR from 'swr';
import fetcher from '../utils/fetcher';
import { PAYMENTS_BASE_URL } from '../constants';

const fetchAttachmentData = (fileName) => {
  const { data, error } = useSWR(fileName ? `${PAYMENTS_BASE_URL}/uploads/${fileName}` : null, fetcher);
  const isLoading = !data && !error;
  return { data, error, isLoading };
};

const useAttachmentsData = (attachments) => {
  return attachments.map((fileName) => ({
    fileName,
    ...fetchAttachmentData(fileName),
  }));
};

export default useAttachmentsData;
