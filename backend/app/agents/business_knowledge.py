"""Curated public business facts drawn from Waltain Energy website pages."""

from __future__ import annotations

import re
from typing import Any

from app.core.config import format_business_public_emails

WEBSITE_KNOWLEDGE = """
Company and contact (Home, About, Contact): Waltain Energy Private Limited is an
India-based renewable energy company. Its tagline is "Empowering Sustainability,
Simplifying Access". The company focuses on practical renewable adoption for
industrial and commercial consumers, balancing commercial savings, compliance,
and dependable execution. Public contact: jalpan@waltainenergy.com,
mailus@waltainenergy.com, connect.waltainenergy@gmail.com,
+91 99982 33956, https://waltainenergy.com. CIN U35105GJ2024PTC152346; GST
24AADCW8509N1ZU. The About page states 30+ years of combined experience, 15.5 MW
capacity secured, and a 180-day solar supply timeline; treat these as website
published company-level claims, not a guarantee for an individual project.

Services (Services, Home): third-party solar power/open-access procurement under
PPA; captive/SPV solar farms; solar EPC; industrial rooftop solar; carbon
management and carbon accounting; energy audits; energy transition advisory;
ESG audit, disclosure and reporting support; BESS enablement. Waltain describes
support from feasibility and structuring through execution, compliance,
commissioning, and reporting. Actual scope depends on project and contract.

Open access (Open Access, Services, FAQ): eligible consumers procure power from a
third-party renewable generator through the state transmission/distribution
network, subject to eligibility, approvals, connectivity, scheduling and
regulatory charges. Typical eligibility cited on the website is contracted
demand of 100 kW or more, but thresholds and rules vary by state and consumer
category. Steps include eligibility/load assessment, PPA structuring, network
applications and scheduling, commissioning, settlement and compliance.

Solar procurement models (Solar Models, Services): Third-party PPA can avoid
upfront solar-plant capex by the buyer; the generator owns the asset and the
customer buys power under agreed terms. Captive/SPV structures involve customer
ownership/equity and different compliance and investment requirements. The
website discusses indicative 12-year PPAs, 4.25 INR/kWh ex-bus tariff, and
approximately 1.5-2 INR/kWh savings for some third-party cases. These are
published illustrative commercial figures, not a binding offer or guaranteed
current price. The case-study page separately shows an illustrative comparison
of grid 8.27, solar 6.82, savings 1.45 INR/unit and monthly savings INR 5,27,079;
that example is not a customer-specific estimate. Final economics depend on load,
tariff, location, consumption, network charges, levies, approvals and contract.
The site has varying tenure/savings claims across pages; do not reconcile them
into a guarantee. Confirm current terms with the business.

Policy and compliance (Policy, Open Access): State rules and charges vary.
Potential components include transmission/wheeling charges, cross-subsidy
surcharge where applicable, banking/balancing, other levies, scheduling,
settlement and payment security such as BG/LC. Feasibility requires the consumer's
state, category, contracted demand, consumption profile, site/connectivity and
current tariff. Website policy material is a high-level overview, not legal or
regulatory advice.

BESS (BESS): Waltain presents behind-the-meter battery energy storage using
Lithium Iron Phosphate (LFP), potentially paired with solar and an energy
management system for peak-demand management, backup/resilience and dispatch.
The page describes modular commercial/industrial configurations and EPC, O&M,
and ESG/REC reporting capabilities. Published indicative outcomes include
solar energy cost INR 4-4.5/kWh, grid tariff INR 7-10/kWh, bill reduction 40-70%
and 4-6 year payback; all depend on project assumptions and are not guaranteed.
Technical specifications, certifications, warranties and availability must be
confirmed for the proposed equipment and contract.

Savings and estimates (Savings Case Study, Policy): Published examples are
illustrative only. Do not calculate or promise customer savings without actual
consumption, current tariff, state/location, contracted demand, PPA tariff and
applicable network charges/levies. The backend has no configured authoritative
pricing rules, so the assistant must not provide a bespoke quote or represent
website examples as a calculated estimate. Offer a project assessment instead.
The website publishes energy-price examples in INR per kWh (or per unit), not
price or savings per square metre, square foot, or solar module. It contains no
approved per-area or per-module price/savings figure. Do not convert energy
savings into an area/module figure without system capacity, generation,
dimensions, location, tariff and applicable charges; explain the distinction
and ask which measure the visitor means. When a question combines topics, answer
each part from the context and clearly identify any figure that is unavailable.

Vision and mission (Vision & Mission, About): the stated vision is to make
renewable energy accessible and advance a sustainable future; the mission is to
deliver accessible, practical renewable solutions that support energy
independence and environmental stewardship.

Team (Team, About): core team listed on the website: Jalpan Dave and Vibhu
Rakesh, Co-Founders; Praneet Kumar, Director. Advisors listed: Dr D M Pestonjee
and Dr Badri Narayan. Refer to their published roles only; do not infer personal
credentials beyond the website.

Partnerships (Partnerships): the website describes PPA/EOI interest, 15.5 MW
capacity secured, an EPC partner, and an ESG database partner. These are company
published capability highlights, not a claim that a specific project is
available or approved.

FAQ: Open access uses the grid network to deliver power from a renewable
generator, subject to charges and approvals. Third-party PPA generally avoids
buyer upfront solar-asset capex. Savings are profile- and regulation-dependent.
Implementation timelines depend on approvals, connectivity and readiness.
Waltain says it supports eligibility, documentation, compliance, execution and
ESG reporting. For a site-specific answer, ask for state/location, contracted
demand, consumption and current tariff, or direct the visitor to the public
contact details above.
""".strip()


_FAQS: tuple[tuple[tuple[str, ...], str], ...] = (
    (("minimum load", "100 kw", "eligibility", "contracted demand"),
     "The website cites 100 kW and above as a typical contracted-demand threshold, but eligibility varies by state and consumer category. A site-specific check needs your location and load details."),
    (("third party", "third-party", "zero investment", "upfront investment", "capex"),
     "In a third-party PPA, the generator owns the solar asset and the eligible customer purchases power under agreed terms, generally without investing upfront in the solar farm. Eligibility, charges and contract terms still need to be checked."),
    (("saving", "savings", "save", "1.5-2", "1.5–2"),
     "Waltain's website publishes indicative savings examples, but actual savings depend on your tariff, load profile, location, PPA terms and applicable charges. The backend does not yet have authoritative pricing rules, so I can't calculate or guarantee a project-specific figure."),
    (("tariff", "4.25", "ppa rate", "price", "pricing", "cost", "quote", "quotation"),
     "The website includes indicative tariff examples, not a binding or customer-specific quote. Actual pricing needs your location, contracted demand, consumption profile and applicable charges. I can help arrange an assessment with Waltain Energy."),
    (("contract duration", "tenure", "how long", "12 year", "12-year"),
     "The website describes 12 years as a typical PPA tenure on some pages; its policy page notes frameworks can vary. The applicable tenure depends on the project and agreed contract."),
    (("timeline", "how fast", "implementation", "180 days", "commissioning"),
     "The website mentions 180 days as a supply timeline in some materials, but actual timing depends on approvals, connectivity and project readiness. It should be confirmed for your project."),
    (("esg", "carbon", "disclosure", "reporting"),
     "Waltain lists ESG disclosure and reporting support, including carbon-management and reporting inputs. The exact scope depends on the engagement."),
    (("bess", "battery", "storage"),
     "Waltain describes behind-the-meter LFP battery energy storage for applications such as peak-demand management, backup and resilience, with project design dependent on your load and operating profile."),
    (("what is open access", "open access"),
     "Open access lets eligible consumers procure renewable electricity from a generator using the state grid network. Eligibility, approvals and network charges depend on your state and consumer profile."),
)


def build_business_context(settings: Any) -> str:
    """Add deployment-configured public contact values to the curated site facts."""
    return (
        f"Configured public business name: {settings.business_name}\n"
        f"Configured website: {settings.business_website_url}\n"
        f"Configured public emails: {format_business_public_emails(settings)}\n"
        f"Configured public phone: {settings.business_public_phone}\n\n"
        f"Approved website knowledge:\n{WEBSITE_KNOWLEDGE}"
    )


def find_grounded_faq_answer(query: str) -> str | None:
    """Return a canned answer only when exactly one FAQ topic is asked."""
    normalized = re.sub(r"\s+", " ", query.casefold()).strip()
    matches = []
    for phrases, answer in _FAQS:
        if any(phrase in normalized for phrase in phrases):
            matches.append(answer)
    return matches[0] if len(matches) == 1 else None