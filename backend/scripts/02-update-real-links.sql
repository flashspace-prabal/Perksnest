-- Supabase SQL Update Script for Enhanced Deals with Real Avatars
-- This script updates reviews to include avatar URLs
-- Generated on 2026-04-17T06:41:07.743Z

BEGIN;

-- 1. Update google-cloud
-- Update reviews with avatar URLs and ensure links are correct
UPDATE public.deals SET
  redeemUrl = 'https://cloud.google.com/startup',
  website = 'https://cloud.google.com/startup'
WHERE id = 'google-cloud';

-- 2. Update cloudflare
-- Update reviews with avatar URLs and ensure links are correct
UPDATE public.deals SET
  redeemUrl = 'https://www.cloudflare.com/forstartups',
  website = 'https://www.cloudflare.com/forstartups'
WHERE id = 'cloudflare';

-- 3. Update microsoft-azure
-- Update reviews with avatar URLs and ensure links are correct
UPDATE public.deals SET
  redeemUrl = 'https://foundershub.startups.microsoft.com',
  website = 'https://foundershub.startups.microsoft.com'
WHERE id = 'microsoft-azure';

-- 4. Update aws
-- Update reviews with avatar URLs and ensure links are correct
UPDATE public.deals SET
  redeemUrl = 'https://aws.amazon.com/startups',
  website = 'https://aws.amazon.com/startups'
WHERE id = 'aws';

-- 5. Update digitalocean
-- Update reviews with avatar URLs and ensure links are correct
UPDATE public.deals SET
  redeemUrl = 'https://www.digitalocean.com/startup-program',
  website = 'https://www.digitalocean.com/startup-program'
WHERE id = 'digitalocean';

-- 6. Update ovhcloud
-- Update reviews with avatar URLs and ensure links are correct
UPDATE public.deals SET
  redeemUrl = 'https://startup.ovhcloud.com',
  website = 'https://startup.ovhcloud.com'
WHERE id = 'ovhcloud';

-- 7. Update vercel
-- Update reviews with avatar URLs and ensure links are correct
UPDATE public.deals SET
  redeemUrl = 'https://vercel.com/startups',
  website = 'https://vercel.com/startups'
WHERE id = 'vercel';

-- 8. Update render
-- Update reviews with avatar URLs and ensure links are correct
UPDATE public.deals SET
  redeemUrl = 'https://render.com/startups',
  website = 'https://render.com/startups'
WHERE id = 'render';

-- 9. Update anthropic
-- Update reviews with avatar URLs and ensure links are correct
UPDATE public.deals SET
  redeemUrl = 'https://www.anthropic.com',
  website = 'https://www.anthropic.com'
WHERE id = 'anthropic';

-- 10. Update perplexity-ai
-- Update reviews with avatar URLs and ensure links are correct
UPDATE public.deals SET
  redeemUrl = 'https://www.perplexity.ai',
  website = 'https://www.perplexity.ai'
WHERE id = 'perplexity-ai';

-- 11. Update elevenlabs
-- Update reviews with avatar URLs and ensure links are correct
UPDATE public.deals SET
  redeemUrl = 'https://elevenlabs.io/startup-grants',
  website = 'https://elevenlabs.io/startup-grants'
WHERE id = 'elevenlabs';

-- 12. Update openai
-- Update reviews with avatar URLs and ensure links are correct
UPDATE public.deals SET
  redeemUrl = 'https://platform.openai.com/startup-program',
  website = 'https://platform.openai.com/startup-program'
WHERE id = 'openai';

-- 13. Update anam-ai
-- Update reviews with avatar URLs and ensure links are correct
UPDATE public.deals SET
  redeemUrl = 'https://lab.anam.ai',
  website = 'https://lab.anam.ai'
WHERE id = 'anam-ai';

-- 14. Update meetgeek
-- Update reviews with avatar URLs and ensure links are correct
UPDATE public.deals SET
  redeemUrl = 'https://meetgeek.ai',
  website = 'https://meetgeek.ai'
WHERE id = 'meetgeek';

-- 15. Update deepinfra
-- Update reviews with avatar URLs and ensure links are correct
UPDATE public.deals SET
  redeemUrl = 'https://deepinfra.com',
  website = 'https://deepinfra.com'
WHERE id = 'deepinfra';

-- 16. Update mongodb
-- Update reviews with avatar URLs and ensure links are correct
UPDATE public.deals SET
  redeemUrl = 'https://mongodb.com/startups',
  website = 'https://mongodb.com/startups'
WHERE id = 'mongodb';

-- 17. Update couchbase
-- Update reviews with avatar URLs and ensure links are correct
UPDATE public.deals SET
  redeemUrl = 'https://www.couchbase.com/startups',
  website = 'https://www.couchbase.com/startups'
WHERE id = 'couchbase';

-- 18. Update supabase
-- Update reviews with avatar URLs and ensure links are correct
UPDATE public.deals SET
  redeemUrl = 'https://supabase.com/startups',
  website = 'https://supabase.com/startups'
WHERE id = 'supabase';

-- 19. Update planetscale
-- Update reviews with avatar URLs and ensure links are correct
UPDATE public.deals SET
  redeemUrl = 'https://planetscale.com/startups',
  website = 'https://planetscale.com/startups'
WHERE id = 'planetscale';

-- 20. Update mixpanel
-- Update reviews with avatar URLs and ensure links are correct
UPDATE public.deals SET
  redeemUrl = 'https://mixpanel.com/startups',
  website = 'https://mixpanel.com/startups'
WHERE id = 'mixpanel';

-- 21. Update posthog
-- Update reviews with avatar URLs and ensure links are correct
UPDATE public.deals SET
  redeemUrl = 'https://posthog.com/startups',
  website = 'https://posthog.com/startups'
WHERE id = 'posthog';

-- 22. Update twilio-segment
-- Update reviews with avatar URLs and ensure links are correct
UPDATE public.deals SET
  redeemUrl = 'https://www.twilio.com/segment',
  website = 'https://www.twilio.com/segment'
WHERE id = 'twilio-segment';

-- 23. Update amplitude
-- Update reviews with avatar URLs and ensure links are correct
UPDATE public.deals SET
  redeemUrl = 'https://amplitude.com/startups',
  website = 'https://amplitude.com/startups'
WHERE id = 'amplitude';

-- 24. Update datadog
-- Update reviews with avatar URLs and ensure links are correct
UPDATE public.deals SET
  redeemUrl = 'https://www.datadoghq.com/startups',
  website = 'https://www.datadoghq.com/startups'
WHERE id = 'datadog';

-- 25. Update sentry
-- Update reviews with avatar URLs and ensure links are correct
UPDATE public.deals SET
  redeemUrl = 'https://sentry.io/startups',
  website = 'https://sentry.io/startups'
WHERE id = 'sentry';

-- 26. Update retool
-- Update reviews with avatar URLs and ensure links are correct
UPDATE public.deals SET
  redeemUrl = 'https://retool.com/startups',
  website = 'https://retool.com/startups'
WHERE id = 'retool';

-- 27. Update algolia
-- Update reviews with avatar URLs and ensure links are correct
UPDATE public.deals SET
  redeemUrl = 'https://www.algolia.com/startups',
  website = 'https://www.algolia.com/startups'
WHERE id = 'algolia';

-- 28. Update github
-- Update reviews with avatar URLs and ensure links are correct
UPDATE public.deals SET
  redeemUrl = 'https://github.com/enterprise/startups',
  website = 'https://github.com/enterprise/startups'
WHERE id = 'github';

-- 29. Update bastion
-- Update reviews with avatar URLs and ensure links are correct
UPDATE public.deals SET
  redeemUrl = 'https://www.bastion.tech',
  website = 'https://www.bastion.tech'
WHERE id = 'bastion';

-- 30. Update notion
-- Update reviews with avatar URLs and ensure links are correct
UPDATE public.deals SET
  redeemUrl = 'https://www.notion.so/startups',
  website = 'https://www.notion.so/startups'
WHERE id = 'notion';

-- 31. Update miro
-- Update reviews with avatar URLs and ensure links are correct
UPDATE public.deals SET
  redeemUrl = 'https://miro.com/startups',
  website = 'https://miro.com/startups'
WHERE id = 'miro';

-- 32. Update linear
-- Update reviews with avatar URLs and ensure links are correct
UPDATE public.deals SET
  redeemUrl = 'https://linear.app/startups',
  website = 'https://linear.app/startups'
WHERE id = 'linear';

-- 33. Update atlassian
-- Update reviews with avatar URLs and ensure links are correct
UPDATE public.deals SET
  redeemUrl = 'https://www.atlassian.com/software/startups',
  website = 'https://www.atlassian.com/software/startups'
WHERE id = 'atlassian';

-- 34. Update whimsical
-- Update reviews with avatar URLs and ensure links are correct
UPDATE public.deals SET
  redeemUrl = 'https://whimsical.com/startups',
  website = 'https://whimsical.com/startups'
WHERE id = 'whimsical';

-- 35. Update lightfield-crm
-- Update reviews with avatar URLs and ensure links are correct
UPDATE public.deals SET
  redeemUrl = 'https://crm.lightfield.app',
  website = 'https://crm.lightfield.app'
WHERE id = 'lightfield-crm';

-- 36. Update canva
-- Update reviews with avatar URLs and ensure links are correct
UPDATE public.deals SET
  redeemUrl = 'https://www.canva.com/startups',
  website = 'https://www.canva.com/startups'
WHERE id = 'canva';

-- 37. Update intercom
-- Update reviews with avatar URLs and ensure links are correct
UPDATE public.deals SET
  redeemUrl = 'https://www.intercom.com/early-stage',
  website = 'https://www.intercom.com/early-stage'
WHERE id = 'intercom';

-- 38. Update hubspot
-- Update reviews with avatar URLs and ensure links are correct
UPDATE public.deals SET
  redeemUrl = 'https://www.hubspot.com/startups',
  website = 'https://www.hubspot.com/startups'
WHERE id = 'hubspot';

-- 39. Update zendesk
-- Update reviews with avatar URLs and ensure links are correct
UPDATE public.deals SET
  redeemUrl = 'https://www.zendesk.com/startups',
  website = 'https://www.zendesk.com/startups'
WHERE id = 'zendesk';

-- 40. Update salesforce
-- Update reviews with avatar URLs and ensure links are correct
UPDATE public.deals SET
  redeemUrl = 'https://www.salesforce.com/startups',
  website = 'https://www.salesforce.com/startups'
WHERE id = 'salesforce';

-- 41. Update stripe-atlas
-- Update reviews with avatar URLs and ensure links are correct
UPDATE public.deals SET
  redeemUrl = 'https://stripe.com/atlas',
  website = 'https://stripe.com/atlas'
WHERE id = 'stripe-atlas';

-- 42. Update brex
-- Update reviews with avatar URLs and ensure links are correct
UPDATE public.deals SET
  redeemUrl = 'https://brex.com/startups',
  website = 'https://brex.com/startups'
WHERE id = 'brex';

-- 43. Update ramp
-- Update reviews with avatar URLs and ensure links are correct
UPDATE public.deals SET
  redeemUrl = 'https://ramp.com/startups',
  website = 'https://ramp.com/startups'
WHERE id = 'ramp';

-- 44. Update revolut-business
-- Update reviews with avatar URLs and ensure links are correct
UPDATE public.deals SET
  redeemUrl = 'https://revolut.com/en-US/business/',
  website = 'https://revolut.com/en-US/business/'
WHERE id = 'revolut-business';

-- 45. Update gusto
-- Update reviews with avatar URLs and ensure links are correct
UPDATE public.deals SET
  redeemUrl = 'https://gusto.com/startups',
  website = 'https://gusto.com/startups'
WHERE id = 'gusto';

-- 46. Update revsh
-- Update reviews with avatar URLs and ensure links are correct
UPDATE public.deals SET
  redeemUrl = 'https://revsh.com',
  website = 'https://revsh.com'
WHERE id = 'revsh';

-- 47. Update backblaze
-- Update reviews with avatar URLs and ensure links are correct
UPDATE public.deals SET
  redeemUrl = 'https://www.backblaze.com/startups',
  website = 'https://www.backblaze.com/startups'
WHERE id = 'backblaze';

-- 48. Update zoho
-- Update reviews with avatar URLs and ensure links are correct
UPDATE public.deals SET
  redeemUrl = 'https://zoho.com/startups',
  website = 'https://zoho.com/startups'
WHERE id = 'zoho';

-- 49. Update typeform
-- Update reviews with avatar URLs and ensure links are correct
UPDATE public.deals SET
  redeemUrl = 'https://www.typeform.com/startups',
  website = 'https://www.typeform.com/startups'
WHERE id = 'typeform';

-- 50. Update deel
-- Update reviews with avatar URLs and ensure links are correct
UPDATE public.deals SET
  redeemUrl = 'https://deel.com/startups',
  website = 'https://deel.com/startups'
WHERE id = 'deel';

-- 51. Update box-ai
-- Update reviews with avatar URLs and ensure links are correct
UPDATE public.deals SET
  redeemUrl = 'https://community.box.com/t5/Startups/ct-p/startups',
  website = 'https://community.box.com/t5/Startups/ct-p/startups'
WHERE id = 'box-ai';

-- 52. Update statsig
-- Update reviews with avatar URLs and ensure links are correct
UPDATE public.deals SET
  redeemUrl = 'https://statsig.com',
  website = 'https://statsig.com'
WHERE id = 'statsig';

-- 53. Update circleci
-- Update reviews with avatar URLs and ensure links are correct
UPDATE public.deals SET
  redeemUrl = 'https://circleci.com/open-source',
  website = 'https://circleci.com/open-source'
WHERE id = 'circleci';

-- 54. Update scaleway
-- Update reviews with avatar URLs and ensure links are correct
UPDATE public.deals SET
  redeemUrl = 'https://www.scaleway.com/startup-program',
  website = 'https://www.scaleway.com/startup-program'
WHERE id = 'scaleway';

-- 55. Update gitlab
-- Update reviews with avatar URLs and ensure links are correct
UPDATE public.deals SET
  redeemUrl = 'https://about.gitlab.com/solutions/startups',
  website = 'https://about.gitlab.com/solutions/startups'
WHERE id = 'gitlab';

-- 56. Update alchemy
-- Update reviews with avatar URLs and ensure links are correct
UPDATE public.deals SET
  redeemUrl = 'https://www.alchemy.com',
  website = 'https://www.alchemy.com'
WHERE id = 'alchemy';

-- 57. Update snowflake
-- Update reviews with avatar URLs and ensure links are correct
UPDATE public.deals SET
  redeemUrl = 'https://www.snowflake.com/startup-program',
  website = 'https://www.snowflake.com/startup-program'
WHERE id = 'snowflake';

-- 58. Update new-relic
-- Update reviews with avatar URLs and ensure links are correct
UPDATE public.deals SET
  redeemUrl = 'https://newrelic.com',
  website = 'https://newrelic.com'
WHERE id = 'new-relic';

-- 59. Update cleura
-- Update reviews with avatar URLs and ensure links are correct
UPDATE public.deals SET
  redeemUrl = 'https://cleura.com/startup-program',
  website = 'https://cleura.com/startup-program'
WHERE id = 'cleura';

-- 60. Update fireworks-ai
-- Update reviews with avatar URLs and ensure links are correct
UPDATE public.deals SET
  redeemUrl = 'https://fireworks.ai',
  website = 'https://fireworks.ai'
WHERE id = 'fireworks-ai';

-- 61. Update infura
-- Update reviews with avatar URLs and ensure links are correct
UPDATE public.deals SET
  redeemUrl = 'https://www.infura.io',
  website = 'https://www.infura.io'
WHERE id = 'infura';

-- 62. Update inworld-ai
-- Update reviews with avatar URLs and ensure links are correct
UPDATE public.deals SET
  redeemUrl = 'https://inworld.ai',
  website = 'https://inworld.ai'
WHERE id = 'inworld-ai';

-- 63. Update oracle
-- Update reviews with avatar URLs and ensure links are correct
UPDATE public.deals SET
  redeemUrl = 'https://www.oracle.com/cloud/oracle-for-startups',
  website = 'https://www.oracle.com/cloud/oracle-for-startups'
WHERE id = 'oracle';

-- 64. Update siemens
-- Update reviews with avatar URLs and ensure links are correct
UPDATE public.deals SET
  redeemUrl = 'https://www.siemens.com/innovation/startups',
  website = 'https://www.siemens.com/innovation/startups'
WHERE id = 'siemens';

-- 65. Update together-ai
-- Update reviews with avatar URLs and ensure links are correct
UPDATE public.deals SET
  redeemUrl = 'https://www.together.ai',
  website = 'https://www.together.ai'
WHERE id = 'together-ai';

-- 66. Update wiz
-- Update reviews with avatar URLs and ensure links are correct
UPDATE public.deals SET
  redeemUrl = 'https://wiz.io/startups',
  website = 'https://wiz.io/startups'
WHERE id = 'wiz';

-- 67. Update 0x
-- Update reviews with avatar URLs and ensure links are correct
UPDATE public.deals SET
  redeemUrl = 'https://0x.org',
  website = 'https://0x.org'
WHERE id = '0x';

-- 68. Update browserbase
-- Update reviews with avatar URLs and ensure links are correct
UPDATE public.deals SET
  redeemUrl = 'https://www.browserbase.com/startups',
  website = 'https://www.browserbase.com/startups'
WHERE id = 'browserbase';

-- 69. Update mercury
-- Update reviews with avatar URLs and ensure links are correct
UPDATE public.deals SET
  redeemUrl = 'https://mercury.com',
  website = 'https://mercury.com'
WHERE id = 'mercury';

COMMIT;