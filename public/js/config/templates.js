/**
 * Starter templates as markdown strings (TPL/TP2) and their menu grouping (TPLG). Add yours here.
 */
const TPL = { Blank: '', Welcome: `# Welcome to Markdown Blocks\n\nDrag blocks from the left, reorder them by their handle, and watch the **preview** update. Type \`## \` at the start of a paragraph to turn it into a heading.\n\n> [!TIP]\n> Select text, then use the format bar or press Ctrl+B, Ctrl+I and Ctrl+K.\n\n- [x] Add a block\n- [ ] Reorder it\n- [ ] Export your .md file\n\n| Feature | Where |\n| --- | --- |\n| Templates | Header |\n| Contents block | Block list |`, README: `# Project name\n\nOne sentence on what this does.\n\n## Install\n\n\`\`\`bash\nnpm install project-name\n\`\`\`\n\n## Usage\n\n1. Import the library\n2. Call the main function\n\n## Contributing\n\n- Fork the repo\n- Open a pull request\n\n---\n\nMIT licensed.`, 'Blog post': `# Post title\n\n*Published today · 5 min read*\n\nA hook that makes people keep reading.\n\n## The problem\n\nDescribe it.\n\n> A quote that backs up your point.\n\n## The fix\n\n- Step one\n- Step two\n\n## Takeaway\n\nWrap up in one paragraph.`, 'Meeting notes': `# Meeting notes\n\n**Date:** \n**Attendees:** \n\n## Agenda\n\n1. Topic one\n2. Topic two\n\n## Decisions\n\n- \n\n## Action items\n\n- [ ] Owner: task` };
const TP2 = {
    'Sales call notes': `# Sales call notes

**Account:** 
**Contact:** 
**Date:** 

## Situation
- Current vendor or process
- What triggered the call

## Qualification
- [ ] Pain confirmed
- [ ] Budget range known
- [ ] Decision maker identified
- [ ] Timeline set

## Objections
> Quote the objection in their words.

## Next steps
1. Send quote by Friday
2. Schedule demo`,
    'Sales proposal': `# Proposal for Client Name

## Summary
One paragraph on the problem and your offer.

## Scope
- Deliverable one
- Deliverable two

## Pricing
| Item | Qty | Price |
| --- | --- | --- |
| Item | 1 | $0 |

> [!NOTE]
> Valid for 30 days.

## Terms
Payment due net 30.`,
    'Pipeline review': `# Weekly pipeline review

## Snapshot
| Stage | Deals | Value |
| --- | --- | --- |
| Lead | 0 | $0 |
| Quoted | 0 | $0 |
| Negotiation | 0 | $0 |
| Closed won | 0 | $0 |

## At risk
- [ ] Deal and why it is stalling

## Close this week
- [ ] Deal and what blocks it

## Actions
1. Owner: action`,
    'Month-end close': `# Month-end close checklist

**Period:** 

## Cash
- [ ] Reconcile bank accounts
- [ ] Review uncleared items

## Receivables and payables
- [ ] Review aging reports
- [ ] Accrue unbilled revenue and unpaid expenses

## Adjustments
- [ ] Post depreciation
- [ ] Review prepaid expenses

## Review
- [ ] Trial balance ties out
- [ ] Variance review against budget

> [!WARNING]
> Lock the period only after sign-off.`,
    'Budget summary': `# Budget summary

| Category | Budget | Actual | Variance |
| --- | --- | --- | --- |
| Revenue | $0 | $0 | $0 |
| Payroll | $0 | $0 | $0 |
| Operations | $0 | $0 | $0 |
| Net | $0 | $0 | $0 |

## Notes on variances
- Category: why it moved

## Forecast
Describe next quarter's outlook.`,
    'Business plan': `# Business plan

## Problem
Who hurts, and how much.

## Solution
What you offer and why it wins.

## Market
| Segment | Size | Notes |
| --- | --- | --- |
| Primary | | |

## Business model
How you make money.

## Go-to-market
- Channel one
- Channel two

## Financial plan
| Year | Revenue | Costs |
| --- | --- | --- |
| 1 | $0 | $0 |

## Risks
- Risk and mitigation`,
    'SWOT analysis': `# SWOT analysis

## Strengths
- 

## Weaknesses
- 

## Opportunities
- 

## Threats
- 

## Priorities
1. Action that builds on a strength`,
    'Web project brief': `# Web project brief

## Goal
What the site must achieve.

## Audience
- Primary visitors

## Pages
- [ ] Home
- [ ] About
- [ ] Contact

## Stack
| Layer | Choice |
| --- | --- |
| Frontend | |
| Hosting | |

## Launch checklist
- [ ] Tested on mobile
- [ ] Performance budget met
- [ ] Analytics installed`,
    'Bug report': `# Bug report

**Environment:** 

## Steps to reproduce
1. Open the page
2. Click the button

## Expected
What should happen.

## Actual
What happened.

@@@text
Paste logs here
@@@`,
    'API reference': `# API reference

## Authentication
Send your key in the header.

@@@bash
curl -H "Authorization: Bearer KEY" https://api.example.com/v1/items
@@@

## Endpoints
| Method | Path | Description |
| --- | --- | --- |
| GET | /v1/items | List items |

> [!IMPORTANT]
> Rate limit: 60 requests per minute.`,
    'Runbook': `# Runbook: service name

## Overview
What it does and who owns it.

## Alerts
| Alert | Severity | First action |
| --- | --- | --- |
| High error rate | Critical | Check dashboards |

## Recovery steps
1. Check dashboards
2. Restart the service
3. Escalate if unresolved in 15 minutes

> [!CAUTION]
> Get approval before changing production.`,
    'SEO plan': `# SEO plan

## Goals
- Organic visits and leads

## Keyword map
| Page | Primary keyword | Intent |
| --- | --- | --- |
| Home | | Navigational |

## Technical checklist
- [ ] Pages crawlable and indexable
- [ ] XML sitemap submitted
- [ ] Core Web Vitals passing
- [ ] Canonical tags and clean URLs

## On-page checklist
- [ ] Title under 60 characters
- [ ] One H1 per page
- [ ] Internal links added
- [ ] Image alt text

## Content calendar
1. Week 1: topic

## Measurement
- Rankings, clicks, conversions`,
    'AEO plan': `# AEO plan: answer engine optimization

## Questions to own
- What is your topic?
- How do I complete the task?

## Answer format
- [ ] Direct answer in the first 40 to 60 words
- [ ] Question as an H2
- [ ] Short lists and tables
- [ ] FAQ section

## Structured data
- [ ] FAQPage schema
- [ ] Organization schema
- [ ] Author and dates

## Authority
- [ ] Cite sources
- [ ] Author credentials visible

## Tracking
| Question | Engine | Cited? |
| --- | --- | --- |
| | | |`
};
for (const k in TP2)
    TPL[k] = TP2[k].replace(/@@@/g, '```');
const TPLG = { 'Starters': ['Welcome', 'README', 'Blog post', 'Meeting notes', 'Blank'], 'Sales': ['Sales call notes', 'Sales proposal', 'Pipeline review'], 'Accounting': ['Month-end close', 'Budget summary'], 'Business': ['Business plan', 'SWOT analysis'], 'Web development': ['Web project brief', 'Bug report'], 'Documentation': ['API reference', 'Runbook'], 'SEO and AEO': ['SEO plan', 'AEO plan'] };
TPL.Resume = `# Your Name

City, ST · you@email.com · (555) 555-0123 · [linkedin.com/in/you](https://linkedin.com/in/you)

## Summary
Two sentences on who you are, what you do best, and the result you deliver.

## Experience

### Job Title, Company
*Month Year – Present · City, ST*
- Achieved X by doing Y, measured by Z
- Led a team of N to deliver a project that saved $
- Improved a process and cut turnaround time by %

### Previous Title, Company
*Month Year – Month Year*
- Result-focused bullet with a number
- Another bullet that shows scope

## Education
**Degree, School** · Year

## Skills
| Area | Skills |
| --- | --- |
| Technical | Tool, Tool, Tool |
| Business | Skill, Skill |

## Certifications
- Certification name, Issuer, Year`;
TPLG.Career = ['Resume'];
