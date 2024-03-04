export type UploadInDto = {
  invoicingMonth: string;
  file: Express.Multer.File;
};

export type UploadOutDto = {
  invoicingMonth: string;
  currencyRates: {
    [key: string]: number;
  };
  invoicesData: InvoiceData[];
};

export type InvoiceData = {
  customer: string;
  custNo: string;
  projectType: string;
  quantity: number;
  pricePerItem: number;
  itemPriceCurrency: string;
  totalPrice: number;
  invoiceCurrency: string;
  status: string;
  totalInvoiceCurrency: number | string;
  invoiceNumber?: string;
  validationErrors?: string[];
};

export const enum INVOCE_COLUMS {
  CUSTOMER = 'Customer',
  CUST_NO = "CustNo'",
  PROJECT_TYPE = 'Project Type',
  QUANTITY = 'Quantity',
  PRICE_PER_ITEM = 'Price Per Item',
  ITEM_PRICE_CURRENCY = 'Item Price Currency',
  TOTAL_PRICE = 'Total Price',
  INVOICE_CURRENCY = 'Invoice Currency',
  STATUS = 'Status',
  INVOICE_NUMBER = 'Invoice #',
}

export const INVOICE_REQUIRED_FIELDS = [
  INVOCE_COLUMS.CUSTOMER,
  INVOCE_COLUMS.CUST_NO,
  INVOCE_COLUMS.PROJECT_TYPE,
  INVOCE_COLUMS.QUANTITY,
  INVOCE_COLUMS.PRICE_PER_ITEM,
  INVOCE_COLUMS.ITEM_PRICE_CURRENCY,
  INVOCE_COLUMS.TOTAL_PRICE,
  INVOCE_COLUMS.INVOICE_CURRENCY,
] as const;
