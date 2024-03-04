import { Router } from 'express';
import { TypedRequestWithBody, TypedResponse } from '../../router/types';
import { UploadInDto, UploadOutDto } from './upload.dto';
import multer from 'multer';
import { getValidAPIError } from '../../errors.utils';
import { processExcelFile } from './upload.utils';
import { HTTP_STATUSES } from '../../constants';

export const uploadRouter = Router();

uploadRouter.post(
  '/',
  multer().single('file'),
  async (req: TypedRequestWithBody<UploadInDto>, res: TypedResponse<UploadOutDto>) => {
    if (!req.file) {
      return res
        .status(HTTP_STATUSES.BAD_REQUEST_400)
        .json(getValidAPIError({ field: 'file', message: 'No file uploaded' }));
    }

    if (!req.body.invoicingMonth) {
      return res
        .status(HTTP_STATUSES.BAD_REQUEST_400)
        .json(getValidAPIError({ field: 'invoicingMonth', message: 'No invoicingMonth param' }));
    }

    try {
      const { currencyRates, invoicesData, invoicingMonth } = await processExcelFile(
        req.file.buffer,
        req.body.invoicingMonth,
      );

      return res.json({
        invoicingMonth,
        currencyRates,
        invoicesData,
      });
    } catch (error: any) {
      if (error.message === 'Invoicing month is not the same with data from file') {
        return res
          .status(HTTP_STATUSES.BAD_REQUEST_400)
          .json(getValidAPIError({ field: 'date', message: error.message }));
      }
      return res
        .status(HTTP_STATUSES.SERVER_ERROR_500)
        .json(getValidAPIError({ field: 'file', message: 'Error processing the file' }));
    }
  },
);
