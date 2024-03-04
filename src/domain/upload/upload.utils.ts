import { Workbook } from 'exceljs';
import { INVOCE_COLUMS, InvoiceData, UploadOutDto, INVOICE_REQUIRED_FIELDS } from './upload.dto';
import { areDatesEqual } from '../../date.utils';

export const processExcelFile = async (fileBuffer: Buffer, invoicingMonth: string): Promise<UploadOutDto> => {
  const workbook = new Workbook();
  await workbook.xlsx.load(fileBuffer);
  const worksheet = workbook.getWorksheet(1); // Assuming the data is in the first sheet

  let headers: string[] = [];
  let isCurrensiesChecked = true;
  const invoicesData: InvoiceData[] = [];
  let invoicingMonthFromFile = '';
  const currencyRates: { [key: string]: number } = {};

  worksheet?.eachRow((row, rowNumber) => {
    // get current year and month
    const rowValues = row.values as Array<any>;

    if (rowNumber === 1) {
      const [, yearMonth] = rowValues;
      invoicingMonthFromFile = yearMonth;
      return;
    }

    if (isCurrensiesChecked) {
      const currencyName = row.getCell(1).value as string;
      const rate = parseFloat(row.getCell(2).value as string);

      if (currencyName.includes('Rate') && rate) {
        currencyRates[currencyName.slice(0, 3)] = rate;
        return;
      } else {
        isCurrensiesChecked = false;
      }
    }

    if (!headers.length) {
      headers = row.values as string[];
      return;
    }

    const rowData: { [key: string]: any } = {};
    row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
      rowData[headers[colNumber]] = cell.value;
    });

    // Check if the row is relevant based on the status or invoice number
    if (rowData[INVOCE_COLUMS.STATUS] === 'Ready' || !!rowData[INVOCE_COLUMS.INVOICE_NUMBER]) {
      const validationErrors: string[] = [];
      Object.keys(rowData).map((key) => {
        const typedKey = key as INVOCE_COLUMS;
        if (!rowData[typedKey] && INVOICE_REQUIRED_FIELDS.includes(key as any)) {
          validationErrors.push(`Missing mandatory field (${key})`);
        }
      });

      const currentInvoiceCurrency = rowData[INVOCE_COLUMS.INVOICE_CURRENCY];
      const currentItemPriceCurrency = rowData[INVOCE_COLUMS.ITEM_PRICE_CURRENCY];
      const currentCurrencyValue =
        (currencyRates[currentInvoiceCurrency] || 0) / (currencyRates[currentItemPriceCurrency] || 0) || 0;
      const currentTotalInvoiceCurrency =
        typeof rowData[INVOCE_COLUMS.TOTAL_PRICE] === 'number'
          ? (rowData[INVOCE_COLUMS.TOTAL_PRICE] || 0) * currentCurrencyValue
          : 0;

      const allFields = Object.keys(rowData).reduce((acc: any, key: any) => {
        const dataByKey = rowData[key];
        if (!dataByKey) {
          return acc;
        }
        return {
          ...acc,
          [key]: dataByKey,
        };
      }, {});

      const invoiceData: InvoiceData = {
        ...allFields,
        validationErrors: validationErrors.length > 0 ? validationErrors : undefined,
        totalInvoiceCurrency: currentTotalInvoiceCurrency || 'All necessary parameters for calculation were not passed',
      };

      invoicesData.push(invoiceData);
    }
  });

  const theSameDates = areDatesEqual(invoicingMonth, invoicingMonthFromFile);

  if (!theSameDates) {
    throw new Error('Invoicing month is not the same with data from file');
  }

  return {
    invoicingMonth: invoicingMonthFromFile,
    currencyRates,
    invoicesData,
  };
};
