import { http } from "@/lib/http";
import {
  CreateIntentRequest, CreateIntentResponse,
  RegisterEvidenceRequest, BasicApiResponse, PaymentIntent
} from "@/types/payment";

const paths = {
  createIntent: "/api/payments/intent",
  registerEvidence: "/api/payments/evidence",
  getIntent: (id: string) => `/api/payments/intent/${id}`,
};

export const PaymentsAPI = {
  createIntent(payload: CreateIntentRequest) {
    return http<CreateIntentResponse>(paths.createIntent, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  registerEvidence(payload: RegisterEvidenceRequest) {
    return http<BasicApiResponse>(paths.registerEvidence, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  getIntent(id: string) {
    return http<{ intent: PaymentIntent }>(paths.getIntent(id), { method: "GET" });
  },
};
