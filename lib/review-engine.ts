import type { AIReview, Application, PriorityLevel, PriorityResult } from "@/types/application";

export const DEMO_OFFICER = {
  id: "officer-101",
  name: "अभिषेक शर्मा",
};

export const DEMO_REFERENCE_DATE = new Date("2026-10-25T12:00:00+05:30");

export function getApplicationPriority(application: Application, now = DEMO_REFERENCE_DATE): PriorityResult {
  const submittedDate = new Date(application.submittedAt);
  const deadlineDate = new Date(application.reviewDeadline);
  const today = now;

  const missingDocuments = application.documents.filter(
    (document) => document.status === "missing" || document.status === "needs_clarification",
  ).length;
  const verificationRequired = application.documents.filter(
    (document) => document.status === "pending_verification",
  ).length;
  const ageInDays = Math.max(0, Math.ceil((today.getTime() - submittedDate.getTime()) / 86400000));
  const overdueDays = Math.max(0, Math.ceil((today.getTime() - deadlineDate.getTime()) / 86400000));

  let score = ageInDays * 2 + missingDocuments * 8 + verificationRequired * 5;

  if (application.status === "returned") score += 12;
  if (application.status === "under_review") score += 4;
  if (overdueDays > 0) score += 18 + overdueDays * 2;

  const conflictDetected =
    application.incomeDetails.reportedIncome !== null &&
    Math.abs(application.incomeDetails.reportedIncome - application.incomeDetails.declaredAnnualIncome) > 25000;

  if (conflictDetected) score += 9;

  let level: PriorityLevel = "low";
  if (score >= 45) level = "critical";
  else if (score >= 28) level = "high";
  else if (score >= 15) level = "medium";

  const reason = [
    overdueDays > 0 ? `${overdueDays} दिन समय-सीमा पार` : "समय-सीमा के भीतर",
    `${missingDocuments} दस्तावेज़ अपूर्ण`,
    verificationRequired > 0 ? `${verificationRequired} सत्यापन लंबित` : "सत्यापन आवश्यक नहीं",
  ].join(" • ");

  const labels: Record<PriorityLevel, string> = {
    critical: "अत्यंत उच्च",
    high: "उच्च",
    medium: "मध्यम",
    low: "निम्न",
  };

  return {
    level,
    score,
    label: labels[level],
    reason,
  };
}

export function generateRuleBasedReview(application: Application): AIReview {
  const missingDocuments = application.documents
    .filter((document) => document.status === "missing" || document.status === "needs_clarification")
    .map((document) => document.name);

  const verificationPoints = application.documents
    .filter((document) => document.status === "pending_verification")
    .map((document) => `${document.name}: ${document.reviewNotes}`);

  const incomeConflict =
    application.incomeDetails.reportedIncome !== null &&
    Math.abs(application.incomeDetails.reportedIncome - application.incomeDetails.declaredAnnualIncome) > 25000;

  const inconsistencies: string[] = [];
  if (incomeConflict) {
    inconsistencies.push(
      `घोषित वार्षिक आय ${application.incomeDetails.declaredAnnualIncome.toLocaleString("en-IN")} रुपये और दर्ज आय ${application.incomeDetails.reportedIncome?.toLocaleString("en-IN")} रुपये में अंतर है।`,
    );
  }

  if (application.incomeDetails.verifierIncome !== null) {
    const difference = Math.abs(
      application.incomeDetails.verifierIncome - application.incomeDetails.declaredAnnualIncome,
    );
    if (difference > 30000) {
      inconsistencies.push(
        `स्थानीय सत्यापन के अनुसार दर्ज आय ${application.incomeDetails.verifierIncome.toLocaleString("en-IN")} रुपये है, जबकि आवेदन में ${application.incomeDetails.declaredAnnualIncome.toLocaleString("en-IN")} रुपये बताया गया है।`,
      );
    }
  }

  const summaryParts = [
    `आवेदक ${application.applicant.name} ने ${new Date(application.submittedAt).toLocaleDateString("hi-IN")} को आवेदन प्रस्तुत किया है।`,
    `वर्तमान स्थिति: ${application.status === "pending" ? "लंबित" : application.status === "under_review" ? "समीक्षा में" : application.status === "returned" ? "सुधार हेतु लौटाया गया" : application.status === "approved" ? "स्वीकृत" : "अस्वीकृत"}.`,
    `घोषित वार्षिक आय ${application.incomeDetails.declaredAnnualIncome.toLocaleString("en-IN")} रुपये है।`,
  ];

  const requiredDocuments =
    missingDocuments.length > 0
      ? missingDocuments
      : ["सभी आवश्यक दस्तावेज़ पूर्ण रूप से प्रस्तुत हैं, परंतु अधिकारी द्वारा अंतिम सत्यापन आवश्यक है।"];

  let nextAction = "अधिकारी द्वारा समीक्षा करें.";
  if (missingDocuments.length > 0) {
    nextAction = "आवश्यक दस्तावेज़ माँगें.";
  } else if (inconsistencies.length > 0) {
    nextAction = "विसंगति का सत्यापन करें.";
  } else if (application.status === "pending" || application.status === "under_review") {
    nextAction = "निर्णय के लिए तैयार.";
  }

  const reasons = [
    "आवेदन में केवल संरचित डेटा का परीक्षण किया गया है; वास्तविक पहचान या बाहरी रिकॉर्ड की पुष्टि नहीं की गई है।",
  ];

  if (missingDocuments.length > 0) {
    reasons.push(`कई दस्तावेज़ अनुपस्थित हैं: ${missingDocuments.join(", ")}.`);
  }
  if (inconsistencies.length > 0) {
    reasons.push(`आय के आंकड़ों में विसंगति पाई गई है, इसलिए दस्तावेज़ और कथन का मिलान आवश्यक है.`);
  }
  if (verificationPoints.length > 0) {
    reasons.push(`स्थानीय सत्यापन या अतिरिक्त स्पष्टीकरण अभी भी लंबित है.`);
  }

  const review: AIReview = {
    summary: summaryParts.join(" "),
    requiredDocuments,
    inconsistencies: inconsistencies.length > 0 ? inconsistencies : ["प्रस्तुत डेटा के आधार पर कोई स्पष्ट विसंगति नहीं पाई गई।"],
    verificationPoints:
      verificationPoints.length > 0
        ? verificationPoints
        : ["सभी सत्यापन बिंदु स्पष्ट रूप से संधारित हैं; अधिकारी को अंतिम निर्णय पर विचार करना होगा।"],
    nextAction,
    reasons,
    recommendation: nextAction,
    mode: "rule-based",
  };

  return review;
}
