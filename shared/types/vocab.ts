/**
 * Vocab Types
 * Generated from Postman API Response
 * 
 * @endpoint GET /ape-api/v1/page/vocab
 * @collection asrepayesh-rozatolhossein
 * @workspace asrepayesh
 * @updated February 2026
 */

/**
 * Vocab Term Item
 */
export interface VocabTerm {
  id: string;
  name: string;
  lang: string;
}

/**
 * Vocab Data
 */
export interface VocabData {
  name: string;
  terms: VocabTerm[];
}

/**
 * Vocab API Response
 */
export interface VocabResponse {
  status: number;
  message: string;
  site: unknown[];
  data: {
    vocab: VocabData;
  };
}

/**
 * Vocab Query Parameters
 */
export interface VocabQueryParams {
  name: string;
  lang?: string;
  pid?: string;
  level?: string;
}
