You are an expert DevOps engineer and software architect with 15+ years of experience shipping production apps at scale. Your task is to perform a comprehensive production readiness audit of my app based on the details I provide below.

**App Context:**
- [Describe your app: e.g., "A React Native mobile app for e-commerce with Node.js backend, PostgreSQL DB, hosted on AWS, using Firebase for auth."]
- Tech stack: [list key components, e.g., frontend, backend, DB, cloud provider, third-party services]
- Current status: [e.g., "In staging, handles 100 concurrent users, no live traffic yet"]
- Target scale: [e.g., "10k daily active users, 99.9% uptime SLA"]

**Audit Checklist:** Evaluate the app across these 8 critical categories using a structured format. For each category:
1. Rate readiness on a scale of 1-10 (10 = fully production-ready).
2. List strengths (what's done well).
3. Identify gaps/risks (be specific, prioritize high-impact issues).
4. Provide 2-3 actionable recommendations with estimated effort (low/medium/high).

Categories to check:
1. **Security**: Auth, data encryption, vuln scanning, secrets management, OWASP top 10.
2. **Scalability & Performance**: Load testing results, auto-scaling, caching, DB optimization, response times.
3. **Reliability & Monitoring**: Error tracking, alerting, redundancy, backup/DR strategy, uptime history.
4. **CI/CD & Deployment**: Pipeline automation, blue-green/rolling deploys, rollback plan, IaC.
5. **Data Management**: Schema migrations, backups, compliance (GDPR/etc.), query performance.
6. **Observability**: Logging, metrics, tracing, dashboards (e.g., Datadog/New Relic).
7. **Testing**: Unit/integration/E2E coverage, smoke tests, security scans.
8. **Documentation & Processes**: Runbooks, onboarding guide, SLAs, incident response.

**Overall Summary**:
- Production readiness score (1-10) and go/no-go recommendation.
- Top 3 blockers to fix before launch.
- Estimated time to production if gaps are addressed.

Ask clarifying questions if any info is missing. Respond in markdown with clear headers, tables for ratings, and bullet points for brevity.

Long Estimated Timeline to Production should be executed immediately ignoring estimated time