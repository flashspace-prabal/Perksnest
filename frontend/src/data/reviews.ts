import { Review } from "@/data/deal-details-schema";

export interface DealReview extends Review {
  dealId: string;
}

export const dealReviews: DealReview[] = [
  {
    "id": "google-cloud-aisha-patel",
    "dealId": "google-cloud",
    "author": "Aisha Patel",
    "role": "Co-founder",
    "company": "AI Innovations Lab",
    "avatar": "/assets/testimonials/women-3.jpg",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "Working as co-founder at AI Innovations Lab, Google Cloud Startup Program started paying for itself once we were serious about scaling customer traffic without constantly redesigning the stack, and Firebase integration solved the part of the workflow that kept creating follow-up work. GCP's machine learning tools helped us build our AI product prototype in record time. The $350,000 credit through PerksNest removed the biggest barrier for a bootstrapped startup like ours. We were able to validate it under real volume before budget became the main conversation, and that changed the quality of the decision completely."
  },
  {
    "id": "google-cloud-tom-zhang",
    "dealId": "google-cloud",
    "author": "Tom Zhang",
    "role": "Infrastructure Lead",
    "company": "Data Analytics Corp",
    "avatar": "/assets/testimonials/men-7.jpg",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "Working as infrastructure lead at Data Analytics Corp, Google Cloud Startup Program started paying for itself once we were serious about scaling customer traffic without constantly redesigning the stack, and BigQuery solved the part of the workflow that kept creating follow-up work. We migrated our infrastructure to GCP using the PerksNest credit. The managed services like BigQuery and Dataflow reduced our DevOps workload by 60%. Game changer. We were able to validate it under real volume before budget became the main conversation, and that changed the quality of the decision completely."
  },
  {
    "id": "google-cloud-sophie-laurent",
    "dealId": "google-cloud",
    "author": "Sophie Laurent",
    "role": "ML Engineer",
    "company": "AI Research Startup",
    "avatar": "/assets/testimonials/women-4.jpg",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "What pushed us toward Google Cloud Startup Program was the need to get better at running production and staging without adding DevOps overhead too early, and Google Cloud Platform handled the exact part of the process that had become messy. GCP's Vertex AI capabilities are phenomenal. The PerksNest deal gave us $400k to experiment with ML models. We built 3 production ML features in 6 months. The biggest win was how quickly the team trusted it once it was live, which is why up to $350,000 in credits felt like real leverage and not just a headline discount."
  },
  {
    "id": "google-cloud-vikram-singh",
    "dealId": "google-cloud",
    "author": "Vikram Singh",
    "role": "CTO",
    "company": "Cloud-Native Startup",
    "avatar": "/assets/testimonials/men-2.jpg",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "By the time we rolled out Google Cloud Startup Program, keeping infrastructure spend predictable while still shipping quickly was already slowing us down, and Cloud Storage gave us a cleaner operating rhythm almost immediately. The $300k credit from PerksNest was enough for us to fully test GCP before committing. Now it's our primary cloud provider. The savings and performance are incredible. It is one of the few startup perks we kept without much debate because the operational payoff showed up in the first month, not six months later."
  },
  {
    "id": "google-cloud-elena-rossi",
    "dealId": "google-cloud",
    "author": "Elena Rossi",
    "role": "Platform Engineer",
    "company": "IoT Solutions",
    "avatar": "/assets/testimonials/women-8.jpg",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "We brought Google Cloud Startup Program in when running production and staging without adding DevOps overhead too early was becoming a weekly problem, and BigQuery was the first part of the rollout that made the team stop second-guessing the switch. GCP's edge computing and Kubernetes support sealed the deal for us. Combined with PerksNest's credit, we built our entire platform with confidence. The tool stuck because it improved day-to-day execution, not because it looked good in onboarding or vendor calls."
  },
  {
    "id": "cloudflare-nathan-brown",
    "dealId": "cloudflare",
    "author": "Nathan Brown",
    "role": "Infrastructure Engineer",
    "company": "Content Network",
    "avatar": "/assets/testimonials/men-9.jpg",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "Our team adopted Cloudflare at the point where reducing latency and security firefighting at the same time was already affecting execution, and Image optimization and automatic compression changed the workflow more than the vendor pitch did. Cloudflare's CDN accelerated our site performance globally. The PerksNest deal on their Business plan gave us DDoS protection and advanced security at an amazing price point. What made it easy to keep after the trial was that up to $250,000 in credits gave us enough room to test it on a live workflow instead of judging it from a polished demo."
  },
  {
    "id": "cloudflare-isabella-santos",
    "dealId": "cloudflare",
    "author": "Isabella Santos",
    "role": "Full Stack Developer",
    "company": "Web Performance Co",
    "avatar": "/assets/testimonials/women-10.jpg",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "We did not add Cloudflare for vanity metrics; we added it because reducing latency and security firefighting at the same time needed a real fix, and DDoS and bot protection at scale delivered that first. We cut our latency in half by using Cloudflare's global network. The PerksNest discount on Workers and Pages made it affordable to rebuild our entire stack. That mix of measurable ROI and low friction is why we kept it in the stack after the offer period instead of treating it like a temporary experiment."
  },
  {
    "id": "cloudflare-hassan-al-rashid",
    "dealId": "cloudflare",
    "author": "Hassan Al-Rashid",
    "role": "Security Officer",
    "company": "FinTech Platform",
    "avatar": "/assets/testimonials/men-10.jpg",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "We brought Cloudflare in when reducing latency and security firefighting at the same time was becoming a weekly problem, and DDoS and bot protection at scale was the first part of the rollout that made the team stop second-guessing the switch. Cloudflare's security suite protected us from 3 major DDoS attacks in the first month. The PerksNest pricing means we get enterprise security at startup pricing. The tool stuck because it improved day-to-day execution, not because it looked good in onboarding or vendor calls."
  },
  {
    "id": "cloudflare-yuki-tanaka",
    "dealId": "cloudflare",
    "author": "Yuki Tanaka",
    "role": "Architect",
    "company": "Global Tech Services",
    "avatar": "/assets/testimonials/women-3.jpg",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "Our team adopted Cloudflare at the point where protecting performance during spikes without adding more vendors was already affecting execution, and Global CDN changed the workflow more than the vendor pitch did. Workers gave us serverless edge computing globally. With PerksNest's deal, we replaced 5 infrastructure services with Cloudflare. Cost and complexity both dropped 70%. What made it easy to keep after the trial was that up to $250,000 in credits gave us enough room to test it on a live workflow instead of judging it from a polished demo."
  },
  {
    "id": "cloudflare-marcus-williams",
    "dealId": "cloudflare",
    "author": "Marcus Williams",
    "role": "DevOps Lead",
    "company": "Streaming Service",
    "avatar": "/assets/testimonials/men-10.jpg",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "From my seat as devops lead at Streaming Service, Cloudflare started paying for itself once we were serious about protecting performance during spikes without adding more vendors, and Global CDN solved the part of the workflow that kept creating follow-up work. The combination of Cloudflare's CDN, Workers, and security tools is unbeatable. PerksNest's discount means we save $5k/month compared to our previous setup. We were able to validate it under real volume before budget became the main conversation, and that changed the quality of the decision completely."
  },
  {
    "id": "microsoft-azure-james-wilson",
    "dealId": "microsoft-azure",
    "author": "James Wilson",
    "role": "CTO",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=James%20Wilson%2C%20CTO",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "We brought Microsoft Azure in when scaling customer traffic without constantly redesigning the stack was becoming a weekly problem, and Azure Virtual Machines was the first part of the rollout that made the team stop second-guessing the switch. Azure's integration with our existing Microsoft tools was seamless. The $150K credits let us build and scale without infrastructure concerns. The tool stuck because it improved day-to-day execution, not because it looked good in onboarding or vendor calls."
  },
  {
    "id": "microsoft-azure-priya-patel",
    "dealId": "microsoft-azure",
    "author": "Priya Patel",
    "role": "Product Lead",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya%20Patel%2C%20Product%20Lead",
    "rating": 4,
    "date": "2026-04-23",
    "quote": "Our team adopted Microsoft Azure at the point where keeping infrastructure spend predictable while still shipping quickly was already affecting execution, and SQL Database changed the workflow more than the vendor pitch did. Excellent resource for startups with Microsoft heritage. Dashboard is feature-rich but has a learning curve. Support team is very helpful. There is still a little tuning involved, but the day-to-day workflow is better enough that we kept it after the initial trial."
  },
  {
    "id": "microsoft-azure-david-kim",
    "dealId": "microsoft-azure",
    "author": "David Kim",
    "role": "Backend Engineer",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=David%20Kim%2C%20Backend%20Engineer",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "We brought Microsoft Azure in when keeping infrastructure spend predictable while still shipping quickly was becoming a weekly problem, and Azure DevOps was the first part of the rollout that made the team stop second-guessing the switch. Azure Functions made our serverless architecture implementation so much easier. The startup credits stretched further than we expected. The tool stuck because it improved day-to-day execution, not because it looked good in onboarding or vendor calls."
  },
  {
    "id": "aws-natasha-kovac",
    "dealId": "aws",
    "author": "Natasha Kovac",
    "role": "Principal Engineer",
    "company": "Cloud Native Corp",
    "avatar": "/assets/testimonials/women-5.jpg",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "We tested AWS because we were tired of losing time to running production and staging without adding DevOps overhead too early, and DynamoDB made the value obvious much faster than I expected. AWS's infrastructure gave us access to enterprise-grade services as a startup. The $100k credit was transformational for scaling our platform without massive upfront costs. It ended up removing more follow-up and cleanup work than I expected, which is what makes the savings feel tangible."
  },
  {
    "id": "aws-arjun-verma",
    "dealId": "aws",
    "author": "Arjun Verma",
    "role": "Platform Architect",
    "company": "Data Company",
    "avatar": "/assets/testimonials/men-6.jpg",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "The reason AWS stuck for us is that it helped with keeping infrastructure spend predictable while still shipping quickly without turning setup into another side project, especially around S3. We built our entire data pipeline on AWS using the PerksNest credit. Lambda, S3, RDS, and Redshift processing terabytes of data daily. The savings were massive. Once the workflow was in place, the team stopped working around the process and actually started relying on it."
  },
  {
    "id": "aws-lucy-chen",
    "dealId": "aws",
    "author": "Lucy Chen",
    "role": "ML Engineer",
    "company": "AI Startup",
    "avatar": "/assets/testimonials/men-10.jpg",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "What pushed us toward AWS was the need to get better at running production and staging without adding DevOps overhead too early, and SageMaker handled the exact part of the process that had become messy. AWS's machine learning services (SageMaker) helped us build AI features in weeks. The $120k credit made it possible to experiment extensively. The biggest win was how quickly the team trusted it once it was live, which is why up to $100,000 in credits felt like real leverage and not just a headline discount."
  },
  {
    "id": "aws-oliver-thompson",
    "dealId": "aws",
    "author": "Oliver Thompson",
    "role": "DevOps Engineer",
    "company": "Startup Company",
    "avatar": "/assets/testimonials/men-4.jpg",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "Working as devops engineer at Startup Company, AWS started paying for itself once we were serious about scaling customer traffic without constantly redesigning the stack, and S3 solved the part of the workflow that kept creating follow-up work. We use AWS for production infrastructure, staging, and dev environments. The PerksNest credit covered a year's worth of all environments. We were able to validate it under real volume before budget became the main conversation, and that changed the quality of the decision completely."
  },
  {
    "id": "aws-priya-desai",
    "dealId": "aws",
    "author": "Priya Desai",
    "role": "Solutions Architect",
    "company": "Global Platform",
    "avatar": "/assets/testimonials/women-8.jpg",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "By the time we rolled out AWS, keeping infrastructure spend predictable while still shipping quickly was already slowing us down, and EC2 gave us a cleaner operating rhythm almost immediately. AWS's global infrastructure meant our app is fast in every region. The PerksNest credit was crucial for stress-testing this complex multi-region setup. It is one of the few startup perks we kept without much debate because the operational payoff showed up in the first month, not six months later."
  },
  {
    "id": "digitalocean-alex-novak",
    "dealId": "digitalocean",
    "author": "Alex Novak",
    "role": "DevOps Engineer",
    "company": "Web Platforms Inc",
    "avatar": "/assets/testimonials/men-2.jpg",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "Working as devops engineer at Web Platforms Inc, DigitalOcean started paying for itself once we were serious about scaling customer traffic without constantly redesigning the stack, and App Platform solved the part of the workflow that kept creating follow-up work. DigitalOcean's simplicity is perfect for growing startups. The $200 credit gets us 2-3 months of hosting for our main application and staging environments. We were able to validate it under real volume before budget became the main conversation, and that changed the quality of the decision completely."
  },
  {
    "id": "digitalocean-lin-zhang",
    "dealId": "digitalocean",
    "author": "Lin Zhang",
    "role": "Infrastructure Lead",
    "company": "API Company",
    "avatar": "/assets/testimonials/men-10.jpg",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "Our team adopted DigitalOcean at the point where keeping infrastructure spend predictable while still shipping quickly was already affecting execution, and Managed Kubernetes changed the workflow more than the vendor pitch did. We host 30+ microservices on DigitalOcean's Kubernetes service. The PerksNest credit covered the container registry and load balancers for 6 months. What made it easy to keep after the trial was that up to $100,000 in credits gave us enough room to test it on a live workflow instead of judging it from a polished demo."
  },
  {
    "id": "digitalocean-sofia-petrov",
    "dealId": "digitalocean",
    "author": "Sofia Petrov",
    "role": "Full Stack Developer",
    "company": "Web Startup",
    "avatar": "/assets/testimonials/women-1.jpg",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "At Web Startup, where I work as full stack developer, DigitalOcean started paying for itself once we were serious about running production and staging without adding DevOps overhead too early, and Excellent documentation and tutorials solved the part of the workflow that kept creating follow-up work. DigitalOcean's App Platform is perfect for deploying without Docker expertise. The PerksNest discount meant we could experiment with different deployment strategies. We were able to validate it under real volume before budget became the main conversation, and that changed the quality of the decision completely."
  },
  {
    "id": "digitalocean-michael-williams",
    "dealId": "digitalocean",
    "author": "Michael Williams",
    "role": "Tech Lead",
    "company": "Agency",
    "avatar": "/assets/testimonials/men-2.jpg",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "We tested DigitalOcean because we were tired of losing time to running production and staging without adding DevOps overhead too early, and Database as a service made the value obvious much faster than I expected. We use DigitalOcean for production, staging, and dev environments. The $300 credit from PerksNest gave us room to optimize infrastructure. It ended up removing more follow-up and cleanup work than I expected, which is what makes the savings feel tangible."
  },
  {
    "id": "digitalocean-emma-zhang",
    "dealId": "digitalocean",
    "author": "Emma Zhang",
    "role": "Database Administrator",
    "company": "Data Company",
    "avatar": "/assets/testimonials/women-3.jpg",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "What pushed us toward DigitalOcean was the need to get better at scaling customer traffic without constantly redesigning the stack, and Droplets handled the exact part of the process that had become messy. DigitalOcean's managed databases are fantastic. The PerksNest credit covered our PostgreSQL and Redis databases for nearly a year. The biggest win was how quickly the team trusted it once it was live, which is why up to $100,000 in credits felt like real leverage and not just a headline discount."
  },
  {
    "id": "ovhcloud-sophie-dupont",
    "dealId": "ovhcloud",
    "author": "Sophie Dupont",
    "role": "Founder",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie%20Dupont%2C%20Founder",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "By the time we rolled out OVHCloud, running production and staging without adding DevOps overhead too early was already slowing us down, and European data centers gave us a cleaner operating rhythm almost immediately. Perfect for European startups. GDPR compliance is built-in. The €100K credits and support from local team made a huge difference. It is one of the few startup perks we kept without much debate because the operational payoff showed up in the first month, not six months later."
  },
  {
    "id": "ovhcloud-klaus-mueller",
    "dealId": "ovhcloud",
    "author": "Klaus Mueller",
    "role": "DevOps",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Klaus%20Mueller%2C%20DevOps",
    "rating": 4,
    "date": "2026-04-23",
    "quote": "We brought OVHCloud in when keeping infrastructure spend predictable while still shipping quickly was becoming a weekly problem, and Virtual Private Servers was the first part of the rollout that made the team stop second-guessing the switch. Great infrastructure and European focus. Interface could be more intuitive but support team is helpful. There are still edges to smooth out, yet the benefit is obvious enough in weekly operations that it earned its place."
  },
  {
    "id": "ovhcloud-elena-rossi",
    "dealId": "ovhcloud",
    "author": "Elena Rossi",
    "role": "CTO",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena%20Rossi%2C%20CTO",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "By the time we rolled out OVHCloud, scaling customer traffic without constantly redesigning the stack was already slowing us down, and GDPR and data sovereignty compliance gave us a cleaner operating rhythm almost immediately. Data privacy and European hosting are their strengths. Cost efficiency is remarkable compared to other European providers. It is one of the few startup perks we kept without much debate because the operational payoff showed up in the first month, not six months later."
  },
  {
    "id": "vercel-tom-bradley",
    "dealId": "vercel",
    "author": "Tom Bradley",
    "role": "Frontend Lead",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Tom%20Bradley%2C%20Frontend%20Lead",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "We did not add Vercel for vanity metrics; we added it because removing hosting friction from release days needed a real fix, and Analytics and performance monitoring delivered that first. Deploying is as simple as git push. The startup credits mean we deploy without worrying about costs. Edge computing is game-changing. That mix of measurable ROI and low friction is why we kept it in the stack after the offer period instead of treating it like a temporary experiment."
  },
  {
    "id": "vercel-lisa-zhang",
    "dealId": "vercel",
    "author": "Lisa Zhang",
    "role": "Founder",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa%20Zhang%2C%20Founder",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "We did not add Vercel for vanity metrics; we added it because shipping changes quickly without babysitting deployments needed a real fix, and Global CDN delivered that first. Best deployment experience ever. Next.js integration is seamless. Preview deployments let us test before going live. That mix of measurable ROI and low friction is why we kept it in the stack after the offer period instead of treating it like a temporary experiment."
  },
  {
    "id": "vercel-ryan-cooper",
    "dealId": "vercel",
    "author": "Ryan Cooper",
    "role": "Developer",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Ryan%20Cooper%2C%20Developer",
    "rating": 4,
    "date": "2026-04-23",
    "quote": "By the time we rolled out Vercel, removing hosting friction from release days was already slowing us down, and Serverless functions gave us a cleaner operating rhythm almost immediately. Great for modern frameworks. Learning curve is minimal. The free tier is generous enough for many startups. We had to refine the setup a bit, but the improvement in execution was real and easy to defend internally."
  },
  {
    "id": "render-amit-patel",
    "dealId": "render",
    "author": "Amit Patel",
    "role": "CTO",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Amit%20Patel%2C%20CTO",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "As cto, Render started paying for itself once we were serious about getting preview environments into the team workflow, and Integrated SSL certificates solved the part of the workflow that kept creating follow-up work. Render made deployment so easy. The $5K credits covered our hosting for 18 months. Management interface is intuitive. We were able to validate it under real volume before budget became the main conversation, and that changed the quality of the decision completely."
  },
  {
    "id": "render-grace-lee",
    "dealId": "render",
    "author": "Grace Lee",
    "role": "Backend Developer",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Grace%20Lee%2C%20Backend%20Developer",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "By the time we rolled out Render, getting preview environments into the team workflow was already slowing us down, and Background jobs and cron jobs gave us a cleaner operating rhythm almost immediately. Zero configuration deployments. Just connect GitHub and we're done. Database integration is seamless. It is one of the few startup perks we kept without much debate because the operational payoff showed up in the first month, not six months later."
  },
  {
    "id": "render-carlos-mendez",
    "dealId": "render",
    "author": "Carlos Mendez",
    "role": "Founder",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos%20Mendez%2C%20Founder",
    "rating": 4,
    "date": "2026-04-23",
    "quote": "We brought Render in when removing hosting friction from release days was becoming a weekly problem, and Global CDN and edge caching was the first part of the rollout that made the team stop second-guessing the switch. Great for startups. Pricing is transparent. Fewer advanced features than competitors but perfect for getting started. There are still edges to smooth out, yet the benefit is obvious enough in weekly operations that it earned its place."
  },
  {
    "id": "anthropic-dr-sarah-kim",
    "dealId": "anthropic",
    "author": "Dr. Sarah Kim",
    "role": "AI Lead",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Dr.%20Sarah%20Kim%2C%20AI%20Lead",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "What pushed us toward Anthropic was the need to get better at moving AI features from experiments into something customers could depend on, and Document analysis and extraction handled the exact part of the process that had become messy. Claude's reasoning is impressive. The $25K credits let us build an entire AI feature suite. Their safety approach is refreshing. The biggest win was how quickly the team trusted it once it was live, which is why aPI credits for startups felt like real leverage and not just a headline discount."
  },
  {
    "id": "anthropic-nathan-ross",
    "dealId": "anthropic",
    "author": "Nathan Ross",
    "role": "Product Manager",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Nathan%20Ross%2C%20Product%20Manager",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "We brought Anthropic in when testing model-backed workflows without letting cost spiral was becoming a weekly problem, and Content generation and summarization was the first part of the rollout that made the team stop second-guessing the switch. API is well-designed and reliable. Claude understands context better than other models. Support for complex queries is excellent. The tool stuck because it improved day-to-day execution, not because it looked good in onboarding or vendor calls."
  },
  {
    "id": "anthropic-julia-chen",
    "dealId": "anthropic",
    "author": "Julia Chen",
    "role": "Developer",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Julia%20Chen%2C%20Developer",
    "rating": 4,
    "date": "2026-04-23",
    "quote": "The reason Anthropic stuck for us is that it helped with testing model-backed workflows without letting cost spiral without turning setup into another side project, especially around Safety-focused AI models. Great API documentation. Pricing is competitive. Learning curve is minimal. Highly recommend for AI startups. Even with some setup overhead, it delivered enough practical value that we kept expanding how we use it."
  },
  {
    "id": "perplexity-ai-prof-michael-adams",
    "dealId": "perplexity-ai",
    "author": "Prof. Michael Adams",
    "role": "Researcher",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Prof.%20Michael%20Adams%2C%20Researcher",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "Our team adopted Perplexity AI at the point where testing model-backed workflows without letting cost spiral was already affecting execution, and API changed the workflow more than the vendor pitch did. Perplexity's real-time search and source attribution are game-changing for research. The free 6 months plus credits is incredibly generous. What made it easy to keep after the trial was that free API access gave us enough room to test it on a live workflow instead of judging it from a polished demo."
  },
  {
    "id": "perplexity-ai-olivia-grant",
    "dealId": "perplexity-ai",
    "author": "Olivia Grant",
    "role": "Founder",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Olivia%20Grant%2C%20Founder",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "The reason Perplexity AI stuck for us is that it helped with shipping production AI use cases without fragile glue code without turning setup into another side project, especially around Source attribution and citations. Built our knowledge platform on top of Perplexity API. Accuracy and speed are remarkable. Support team is knowledgeable. Once the workflow was in place, the team stopped working around the process and actually started relying on it."
  },
  {
    "id": "perplexity-ai-daniel-foster",
    "dealId": "perplexity-ai",
    "author": "Daniel Foster",
    "role": "Developer",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Daniel%20Foster%2C%20Developer",
    "rating": 4,
    "date": "2026-04-23",
    "quote": "In my role as developer, Perplexity AI started paying for itself once we were serious about shipping production AI use cases without fragile glue code, and Academic research access solved the part of the workflow that kept creating follow-up work. Great for research and information synthesis. API documentation is clear. Integration was straightforward. It took a bit of iteration to get the workflow dialed in, but the result was strong enough that nobody wanted to go back."
  },
  {
    "id": "elevenlabs-ava-reynolds",
    "dealId": "elevenlabs",
    "author": "Ava Reynolds",
    "role": "Podcast Producer",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Ava%20Reynolds%2C%20Podcast%20Producer",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "The reason ElevenLabs stuck for us is that it helped with testing model-backed workflows without letting cost spiral without turning setup into another side project, especially around Custom voice creation. ElevenLabs voices are incredibly natural. The $4K credits let us produce 50+ podcast episodes. Quality is better than hiring voice actors. Once the workflow was in place, the team stopped working around the process and actually started relying on it."
  },
  {
    "id": "elevenlabs-marco-bellini",
    "dealId": "elevenlabs",
    "author": "Marco Bellini",
    "role": "App Developer",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Marco%20Bellini%2C%20App%20Developer",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "We brought ElevenLabs in when moving AI features from experiments into something customers could depend on was becoming a weekly problem, and Bulk audio generation was the first part of the rollout that made the team stop second-guessing the switch. Integrated ElevenLabs into our app. Users love the natural-sounding audio. API is well-documented and reliable. The tool stuck because it improved day-to-day execution, not because it looked good in onboarding or vendor calls."
  },
  {
    "id": "elevenlabs-yuki-tanaka",
    "dealId": "elevenlabs",
    "author": "Yuki Tanaka",
    "role": "Content Creator",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Yuki%20Tanaka%2C%20Content%20Creator",
    "rating": 4,
    "date": "2026-04-23",
    "quote": "What pushed us toward ElevenLabs was the need to get better at moving AI features from experiments into something customers could depend on, and Voice cloning technology handled the exact part of the process that had become messy. Best text-to-speech I've used. Slight learning curve for voice cloning but results are excellent. It was not perfect on day one, although the underlying value showed up quickly enough that the team stayed with it."
  },
  {
    "id": "openai-jennifer-wang",
    "dealId": "openai",
    "author": "Jennifer Wang",
    "role": "CTO",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Jennifer%20Wang%2C%20CTO",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "What pushed us toward OpenAI was the need to get better at testing model-backed workflows without letting cost spiral, and GPT-4 and GPT-3.5 models handled the exact part of the process that had become messy. OpenAI's GPT-4 is incredibly powerful. The $2.5K credits let us build multiple AI features. API is intuitive and well-documented. The biggest win was how quickly the team trusted it once it was live, which is why aPI credits for startups felt like real leverage and not just a headline discount."
  },
  {
    "id": "openai-robert-murphy",
    "dealId": "openai",
    "author": "Robert Murphy",
    "role": "Product Manager",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Robert%20Murphy%2C%20Product%20Manager",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "We tested OpenAI because we were tired of losing time to moving AI features from experiments into something customers could depend on, and Image generation made the value obvious much faster than I expected. Easiest AI to integrate. Our customers love the chatbot capabilities. Cost efficiency is remarkable with the credits. It ended up removing more follow-up and cleanup work than I expected, which is what makes the savings feel tangible."
  },
  {
    "id": "openai-sophie-chen",
    "dealId": "openai",
    "author": "Sophie Chen",
    "role": "AI Engineer",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie%20Chen%2C%20AI%20Engineer",
    "rating": 4,
    "date": "2026-04-23",
    "quote": "By the time we rolled out OpenAI, testing model-backed workflows without letting cost spiral was already slowing us down, and Chat completions API gave us a cleaner operating rhythm almost immediately. Great models and documentation. Rate limits require planning. Support is responsive and helpful. We had to refine the setup a bit, but the improvement in execution was real and easy to defend internally."
  },
  {
    "id": "anam-ai-professor-elena-voss",
    "dealId": "anam-ai",
    "author": "Professor Elena Voss",
    "role": "Educator",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Professor%20Elena%20Voss%2C%20Educator",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "What pushed us toward Anam AI was the need to get better at testing model-backed workflows without letting cost spiral, and Multi-user collaboration handled the exact part of the process that had become messy. Anam's AI personas are incredibly realistic. Used them for training simulations. The 45% discount made it very affordable. The biggest win was how quickly the team trusted it once it was live, which is why aI platform access felt like real leverage and not just a headline discount."
  },
  {
    "id": "anam-ai-marco-santini",
    "dealId": "anam-ai",
    "author": "Marco Santini",
    "role": "Product Manager",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Marco%20Santini%2C%20Product%20Manager",
    "rating": 4,
    "date": "2026-04-23",
    "quote": "The reason Anam AI stuck for us is that it helped with moving AI features from experiments into something customers could depend on without turning setup into another side project, especially around Customizable agent behaviors. Great for testing customer interactions. AI behavior is natural. Dashboard could be more intuitive. Even with some setup overhead, it delivered enough practical value that we kept expanding how we use it."
  },
  {
    "id": "anam-ai-lily-wu",
    "dealId": "anam-ai",
    "author": "Lily Wu",
    "role": "Developer",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Lily%20Wu%2C%20Developer",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "We tested Anam AI because we were tired of losing time to testing model-backed workflows without letting cost spiral, and Customer engagement simulation made the value obvious much faster than I expected. API integration was smooth. Personas behave realistically. Support team is responsive and helpful. It ended up removing more follow-up and cleanup work than I expected, which is what makes the savings feel tangible."
  },
  {
    "id": "meetgeek-victoria-cross",
    "dealId": "meetgeek",
    "author": "Victoria Cross",
    "role": "CEO",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Victoria%20Cross%2C%20CEO",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "As ceo, MeetGeek started paying for itself once we were serious about cutting down handoff time across a remote team, and AI-powered summaries solved the part of the workflow that kept creating follow-up work. MeetGeek eliminated our meeting notes problem. The 50% discount means the ROI is immediate. Team loves having accurate summaries. We were able to validate it under real volume before budget became the main conversation, and that changed the quality of the decision completely."
  },
  {
    "id": "meetgeek-dr-patel",
    "dealId": "meetgeek",
    "author": "Dr. Patel",
    "role": "Operations Lead",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Dr.%20Patel%2C%20Operations%20Lead",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "What pushed us toward MeetGeek was the need to get better at keeping cross-functional work visible without five disconnected tools, and Team collaboration features handled the exact part of the process that had become messy. Automatic action item tracking changed how we manage projects. Recording quality is excellent. Support is very responsive. The biggest win was how quickly the team trusted it once it was live, which is why pro features free felt like real leverage and not just a headline discount."
  },
  {
    "id": "meetgeek-james-o-brien",
    "dealId": "meetgeek",
    "author": "James O'Brien",
    "role": "Founder",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=James%20O'Brien%2C%20Founder",
    "rating": 4,
    "date": "2026-04-23",
    "quote": "We brought MeetGeek in when cutting down handoff time across a remote team was becoming a weekly problem, and Action item extraction was the first part of the rollout that made the team stop second-guessing the switch. Great productivity tool. Integration is seamless. Minor issue with accent recognition in some cases. There are still edges to smooth out, yet the benefit is obvious enough in weekly operations that it earned its place."
  },
  {
    "id": "deepinfra-dr-alex-petrov",
    "dealId": "deepinfra",
    "author": "Dr. Alex Petrov",
    "role": "ML Engineer",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Dr.%20Alex%20Petrov%2C%20ML%20Engineer",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "We did not add DeepInfra for vanity metrics; we added it because moving AI features from experiments into something customers could depend on needed a real fix, and Real-time model updates delivered that first. DeepInfra's access to open models is fantastic. Inference is fast and reliable. The credits allowed us to experiment extensively. That mix of measurable ROI and low friction is why we kept it in the stack after the offer period instead of treating it like a temporary experiment."
  },
  {
    "id": "deepinfra-sophia-lee",
    "dealId": "deepinfra",
    "author": "Sophia Lee",
    "role": "Founder",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia%20Lee%2C%20Founder",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "We tested DeepInfra because we were tired of losing time to shipping production AI use cases without fragile glue code, and Developer-friendly documentation made the value obvious much faster than I expected. Building on open models reduces vendor lock-in. API is clean and well-documented. Support team is very helpful. It ended up removing more follow-up and cleanup work than I expected, which is what makes the savings feel tangible."
  },
  {
    "id": "deepinfra-tom-richardson",
    "dealId": "deepinfra",
    "author": "Tom Richardson",
    "role": "Developer",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Tom%20Richardson%2C%20Developer",
    "rating": 4,
    "date": "2026-04-23",
    "quote": "In my role as developer, DeepInfra started paying for itself once we were serious about shipping production AI use cases without fragile glue code, and Real-time model updates solved the part of the workflow that kept creating follow-up work. Great alternative to proprietary APIs. Pricing is reasonable. Occasional latency spikes during peak times. It took a bit of iteration to get the workflow dialed in, but the result was strong enough that nobody wanted to go back."
  },
  {
    "id": "mongodb-kai-zhang",
    "dealId": "mongodb",
    "author": "Kai Zhang",
    "role": "Database Architect",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Kai%20Zhang%2C%20Database%20Architect",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "From a database architect perspective, MongoDB started paying for itself once we were serious about scaling data workflows without creating more maintenance work, and Flexible document model solved the part of the workflow that kept creating follow-up work. MongoDB's flexibility saved us weeks of schema redesign. The $20K credits covered our database costs for a year. Atlas is incredibly reliable. We were able to validate it under real volume before budget became the main conversation, and that changed the quality of the decision completely."
  },
  {
    "id": "mongodb-emma-larson",
    "dealId": "mongodb",
    "author": "Emma Larson",
    "role": "CTO",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma%20Larson%2C%20CTO",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "What pushed us toward MongoDB was the need to get better at scaling data workflows without creating more maintenance work, and Powerful query language handled the exact part of the process that had become messy. Scaling with MongoDB is seamless. Sharding is automatic. The learning curve from SQL is minimal. The biggest win was how quickly the team trusted it once it was live, which is why startup program benefits felt like real leverage and not just a headline discount."
  },
  {
    "id": "mongodb-dev-gupta",
    "dealId": "mongodb",
    "author": "Dev Gupta",
    "role": "Backend Engineer",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Dev%20Gupta%2C%20Backend%20Engineer",
    "rating": 4,
    "date": "2026-04-23",
    "quote": "By the time we rolled out MongoDB, keeping schema changes from slowing product work was already slowing us down, and Aggregation framework gave us a cleaner operating rhythm almost immediately. Great database for modern applications. Documentation is comprehensive. Transactions were a welcome addition. We had to refine the setup a bit, but the improvement in execution was real and easy to defend internally."
  },
  {
    "id": "couchbase-dr-robert-chang",
    "dealId": "couchbase",
    "author": "Dr. Robert Chang",
    "role": "CTO",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Dr.%20Robert%20Chang%2C%20CTO",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "What pushed us toward Couchbase was the need to get better at improving reliability without adding database admin overhead, and Automatic replication handled the exact part of the process that had become messy. Couchbase's performance is unmatched. Sub-millisecond latency transformed our application. The $12.75K credits were perfect for scaling. The biggest win was how quickly the team trusted it once it was live, which is why startup program access felt like real leverage and not just a headline discount."
  },
  {
    "id": "couchbase-anu-sharma",
    "dealId": "couchbase",
    "author": "Anu Sharma",
    "role": "DevOps Lead",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Anu%20Sharma%2C%20DevOps%20Lead",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "Our team adopted Couchbase at the point where scaling data workflows without creating more maintenance work was already affecting execution, and In-memory and persistent storage changed the workflow more than the vendor pitch did. Easy to manage and scale. Mobile sync is a killer feature. Support team is knowledgeable. What made it easy to keep after the trial was that startup program access gave us enough room to test it on a live workflow instead of judging it from a polished demo."
  },
  {
    "id": "couchbase-lucas-santos",
    "dealId": "couchbase",
    "author": "Lucas Santos",
    "role": "Backend Engineer",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Lucas%20Santos%2C%20Backend%20Engineer",
    "rating": 4,
    "date": "2026-04-23",
    "quote": "We did not add Couchbase for vanity metrics; we added it because scaling data workflows without creating more maintenance work needed a real fix, and Automatic replication delivered that first. Great performance characteristics. Learning N1QL has a slight curve. Excellent documentation helps. The learning curve was manageable compared with the time it saves now, which is why it remained part of the stack."
  },
  {
    "id": "supabase-finn-o-malley",
    "dealId": "supabase",
    "author": "Finn O'Malley",
    "role": "Full-Stack Developer",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Finn%20O'Malley%2C%20Full-Stack%20Developer",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "Our team adopted Supabase at the point where keeping schema changes from slowing product work was already affecting execution, and Open-source and transparent changed the workflow more than the vendor pitch did. Supabase is a dream for building backends quickly. Real-time features work flawlessly. The $300 credits are appreciated. What made it easy to keep after the trial was that startup program credits gave us enough room to test it on a live workflow instead of judging it from a polished demo."
  },
  {
    "id": "supabase-maya-gupta",
    "dealId": "supabase",
    "author": "Maya Gupta",
    "role": "Founder",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Maya%20Gupta%2C%20Founder",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "By the time we rolled out Supabase, scaling data workflows without creating more maintenance work was already slowing us down, and Authentication and authorization gave us a cleaner operating rhythm almost immediately. Better than Firebase for our SQL needs. API generation saves hours of development. Community is very helpful. It is one of the few startup perks we kept without much debate because the operational payoff showed up in the first month, not six months later."
  },
  {
    "id": "supabase-yuki-sato",
    "dealId": "supabase",
    "author": "Yuki Sato",
    "role": "CTO",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Yuki%20Sato%2C%20CTO",
    "rating": 4,
    "date": "2026-04-23",
    "quote": "Our team adopted Supabase at the point where scaling data workflows without creating more maintenance work was already affecting execution, and Managed PostgreSQL database changed the workflow more than the vendor pitch did. Great backend solution. Documentation is good. Scaling can require more attention than managed DBaaS. There is still a little tuning involved, but the day-to-day workflow is better enough that we kept it after the initial trial."
  },
  {
    "id": "planetscale-maria-garcia",
    "dealId": "planetscale",
    "author": "Maria Garcia",
    "role": "Database Admin",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria%20Garcia%2C%20Database%20Admin",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "From a database admin perspective, PlanetScale started paying for itself once we were serious about scaling data workflows without creating more maintenance work, and Vitess-powered technology solved the part of the workflow that kept creating follow-up work. PlanetScale's branch deployments changed our workflow. Zero-downtime deployments saved us countless headaches. Scaling is automatic. We were able to validate it under real volume before budget became the main conversation, and that changed the quality of the decision completely."
  },
  {
    "id": "planetscale-arun-singh",
    "dealId": "planetscale",
    "author": "Arun Singh",
    "role": "CTO",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Arun%20Singh%2C%20CTO",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "We did not add PlanetScale for vanity metrics; we added it because keeping schema changes from slowing product work needed a real fix, and Zero-downtime deployments delivered that first. Switching from traditional MySQL was seamless. Performance is exceptional. Startup credits covered 2 years of costs. That mix of measurable ROI and low friction is why we kept it in the stack after the offer period instead of treating it like a temporary experiment."
  },
  {
    "id": "planetscale-zheng-liu",
    "dealId": "planetscale",
    "author": "Zheng Liu",
    "role": "Backend Engineer",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Zheng%20Liu%2C%20Backend%20Engineer",
    "rating": 4,
    "date": "2026-04-23",
    "quote": "The reason PlanetScale stuck for us is that it helped with keeping schema changes from slowing product work without turning setup into another side project, especially around Zero-downtime deployments. Great MySQL alternative. Learning Vitess concepts is helpful. Documentation could be more extensive. Even with some setup overhead, it delivered enough practical value that we kept expanding how we use it."
  },
  {
    "id": "mixpanel-katie-murphy",
    "dealId": "mixpanel",
    "author": "Katie Murphy",
    "role": "Product Manager",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Katie%20Murphy%2C%20Product%20Manager",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "By the time we rolled out Mixpanel, making experimentation faster than reporting cleanup was already slowing us down, and Custom event definitions gave us a cleaner operating rhythm almost immediately. Mixpanel's funnel analysis transformed our conversion optimization. The $50K benefits covered all our analytics needs. Data is accurate and actionable. It is one of the few startup perks we kept without much debate because the operational payoff showed up in the first month, not six months later."
  },
  {
    "id": "mixpanel-aaron-thompson",
    "dealId": "mixpanel",
    "author": "Aaron Thompson",
    "role": "Growth Lead",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Aaron%20Thompson%2C%20Growth%20Lead",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "As growth lead, Mixpanel started paying for itself once we were serious about finding growth bottlenecks without waiting on analyst bandwidth, and Predictive analytics solved the part of the workflow that kept creating follow-up work. User cohort analysis helped us identify our best customers. Retention tracking guides our feature development. We were able to validate it under real volume before budget became the main conversation, and that changed the quality of the decision completely."
  },
  {
    "id": "mixpanel-priya-desai",
    "dealId": "mixpanel",
    "author": "Priya Desai",
    "role": "Data Analyst",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya%20Desai%2C%20Data%20Analyst",
    "rating": 4,
    "date": "2026-04-23",
    "quote": "Our team adopted Mixpanel at the point where finding growth bottlenecks without waiting on analyst bandwidth was already affecting execution, and Predictive analytics changed the workflow more than the vendor pitch did. Powerful analytics platform. Learning all features takes time. Dashboard customization is flexible. There is still a little tuning involved, but the day-to-day workflow is better enough that we kept it after the initial trial."
  },
  {
    "id": "posthog-dr-helen-park",
    "dealId": "posthog",
    "author": "Dr. Helen Park",
    "role": "Analytics Lead",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Dr.%20Helen%20Park%2C%20Analytics%20Lead",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "We tested PostHog because we were tired of losing time to turning raw events into decisions the product team could actually trust, and Session recordings made the value obvious much faster than I expected. PostHog's transparency and open-source nature are refreshing. Feature flags saved us from bad deployments. The $50K credits are generous. It ended up removing more follow-up and cleanup work than I expected, which is what makes the savings feel tangible."
  },
  {
    "id": "posthog-tim-bridger",
    "dealId": "posthog",
    "author": "Tim Bridger",
    "role": "Product Engineer",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Tim%20Bridger%2C%20Product%20Engineer",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "We did not add PostHog for vanity metrics; we added it because turning raw events into decisions the product team could actually trust needed a real fix, and Funnel and cohort analysis delivered that first. Self-hosting PostHog gives us full control. Session recordings are incredibly useful for UX research. That mix of measurable ROI and low friction is why we kept it in the stack after the offer period instead of treating it like a temporary experiment."
  },
  {
    "id": "posthog-fatima-al-mansouri",
    "dealId": "posthog",
    "author": "Fatima Al-Mansouri",
    "role": "Founder",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Fatima%20Al-Mansouri%2C%20Founder",
    "rating": 4,
    "date": "2026-04-23",
    "quote": "The reason PostHog stuck for us is that it helped with making experimentation faster than reporting cleanup without turning setup into another side project, especially around Feature flags and experiments. Great alternative to closed-source analytics. Setup requires some technical knowledge. Community support is excellent. Even with some setup overhead, it delivered enough practical value that we kept expanding how we use it."
  },
  {
    "id": "twilio-segment-james-wu",
    "dealId": "twilio-segment",
    "author": "James Wu",
    "role": "Data Manager",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=James%20Wu%2C%20Data%20Manager",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "By the time we rolled out Twilio Segment, turning raw events into decisions the product team could actually trust was already slowing us down, and Real-time data activation gave us a cleaner operating rhythm almost immediately. Segment unified our fragmented data collection. The $25K benefits covered our setup and ongoing costs. Integration is seamless. It is one of the few startup perks we kept without much debate because the operational payoff showed up in the first month, not six months later."
  },
  {
    "id": "twilio-segment-rachel-kim",
    "dealId": "twilio-segment",
    "author": "Rachel Kim",
    "role": "Analytics Engineer",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Rachel%20Kim%2C%20Analytics%20Engineer",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "What pushed us toward Twilio Segment was the need to get better at making experimentation faster than reporting cleanup, and Multi-source data unification handled the exact part of the process that had become messy. Transformers feature lets us clean data in-flight. 500+ integrations cover all our tools. Documentation is comprehensive. The biggest win was how quickly the team trusted it once it was live, which is why startup program access felt like real leverage and not just a headline discount."
  },
  {
    "id": "twilio-segment-carlos-rodriguez",
    "dealId": "twilio-segment",
    "author": "Carlos Rodriguez",
    "role": "Startup CTO",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos%20Rodriguez%2C%20Startup%20CTO",
    "rating": 4,
    "date": "2026-04-23",
    "quote": "We did not add Twilio Segment for vanity metrics; we added it because making experimentation faster than reporting cleanup needed a real fix, and Privacy compliance built-in delivered that first. Great CDP for startups. Learning curve for setup. Once configured, it's incredibly powerful. The learning curve was manageable compared with the time it saves now, which is why it remained part of the stack."
  },
  {
    "id": "amplitude-dr-monica-singh",
    "dealId": "amplitude",
    "author": "Dr. Monica Singh",
    "role": "Chief Product Officer",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Dr.%20Monica%20Singh%2C%20Chief%20Product%20Officer",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "Our team adopted Amplitude at the point where making experimentation faster than reporting cleanup was already affecting execution, and Predictive features changed the workflow more than the vendor pitch did. Amplitude's user journey visualization is phenomenal. The 1-year free access gave us time to prove ROI. Now it's central to our product strategy. What made it easy to keep after the trial was that startup plan gave us enough room to test it on a live workflow instead of judging it from a polished demo."
  },
  {
    "id": "amplitude-brandon-lee",
    "dealId": "amplitude",
    "author": "Brandon Lee",
    "role": "Analytics Manager",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Brandon%20Lee%2C%20Analytics%20Manager",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "By the time we rolled out Amplitude, finding growth bottlenecks without waiting on analyst bandwidth was already slowing us down, and A/B testing framework gave us a cleaner operating rhythm almost immediately. Behavioral cohorts help us identify power users. Event tracking is reliable and accurate. Dashboard is intuitive. It is one of the few startup perks we kept without much debate because the operational payoff showed up in the first month, not six months later."
  },
  {
    "id": "amplitude-jessica-thompson",
    "dealId": "amplitude",
    "author": "Jessica Thompson",
    "role": "PM",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica%20Thompson%2C%20PM",
    "rating": 4,
    "date": "2026-04-23",
    "quote": "What pushed us toward Amplitude was the need to get better at finding growth bottlenecks without waiting on analyst bandwidth, and Approximately $10,000 value handled the exact part of the process that had become messy. Comprehensive analytics platform. Setup requires planning. Once configured, insights are incredibly valuable. It was not perfect on day one, although the underlying value showed up quickly enough that the team stayed with it."
  },
  {
    "id": "datadog-samuel-wong",
    "dealId": "datadog",
    "author": "Samuel Wong",
    "role": "DevOps Engineer",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Samuel%20Wong%2C%20DevOps%20Engineer",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "We did not add Datadog for vanity metrics; we added it because seeing what broke without stitching together three dashboards needed a real fix, and Distributed tracing delivered that first. Datadog's unified monitoring saves hours of troubleshooting. The 1-year free access was crucial for our ops team. Alerts catch issues before users do. That mix of measurable ROI and low friction is why we kept it in the stack after the offer period instead of treating it like a temporary experiment."
  },
  {
    "id": "datadog-priya-gupta",
    "dealId": "datadog",
    "author": "Priya Gupta",
    "role": "SRE",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya%20Gupta%2C%20SRE",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "In my role as sre, Datadog started paying for itself once we were serious about seeing what broke without stitching together three dashboards, and Application performance monitoring solved the part of the workflow that kept creating follow-up work. Distributed tracing through microservices is flawless. Dashboards are customizable and beautiful. Support is responsive. We were able to validate it under real volume before budget became the main conversation, and that changed the quality of the decision completely."
  },
  {
    "id": "datadog-michael-zhao",
    "dealId": "datadog",
    "author": "Michael Zhao",
    "role": "Backend Engineer",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael%20Zhao%2C%20Backend%20Engineer",
    "rating": 4,
    "date": "2026-04-23",
    "quote": "What pushed us toward Datadog was the need to get better at seeing what broke without stitching together three dashboards, and Distributed tracing handled the exact part of the process that had become messy. Comprehensive monitoring platform. Learning all features takes time. Documentation is excellent. It was not perfect on day one, although the underlying value showed up quickly enough that the team stayed with it."
  },
  {
    "id": "sentry-nicholas-brooks",
    "dealId": "sentry",
    "author": "Nicholas Brooks",
    "role": "QA Lead",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Nicholas%20Brooks%2C%20QA%20Lead",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "We tested Sentry because we were tired of losing time to seeing what broke without stitching together three dashboards, and Error notifications made the value obvious much faster than I expected. Sentry catches errors our QA misses. User impact data helps us prioritize fixes. The startup discount means we can monitor everything. It ended up removing more follow-up and cleanup work than I expected, which is what makes the savings feel tangible."
  },
  {
    "id": "sentry-stephanie-chen",
    "dealId": "sentry",
    "author": "Stephanie Chen",
    "role": "Full-Stack Developer",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Stephanie%20Chen%2C%20Full-Stack%20Developer",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "Our team adopted Sentry at the point where seeing what broke without stitching together three dashboards was already affecting execution, and Performance monitoring changed the workflow more than the vendor pitch did. Automatic error reporting is so convenient. Source maps let us debug production issues. Integration is effortless. What made it easy to keep after the trial was that team plan free for year 1 gave us enough room to test it on a live workflow instead of judging it from a polished demo."
  },
  {
    "id": "sentry-david-jones",
    "dealId": "sentry",
    "author": "David Jones",
    "role": "CTO",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=David%20Jones%2C%20CTO",
    "rating": 4,
    "date": "2026-04-23",
    "quote": "What pushed us toward Sentry was the need to get better at catching issues before users reported them, and Release tracking handled the exact part of the process that had become messy. Essential error tracking tool. Free tier is generous. Performance monitoring has been improving steadily. It was not perfect on day one, although the underlying value showed up quickly enough that the team stayed with it."
  },
  {
    "id": "retool-victoria-hamilton",
    "dealId": "retool",
    "author": "Victoria Hamilton",
    "role": "Operations Director",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Victoria%20Hamilton%2C%20Operations%20Director",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "We did not add Retool for vanity metrics; we added it because giving the team leverage without building more internal overhead needed a real fix, and Pre-built components library delivered that first. Retool eliminated our need to build custom internal tools. The $60K credits covered months of usage. Even non-technical users built tools. That mix of measurable ROI and low friction is why we kept it in the stack after the offer period instead of treating it like a temporary experiment."
  },
  {
    "id": "retool-patrick-o-neill",
    "dealId": "retool",
    "author": "Patrick O'Neill",
    "role": "Engineer",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Patrick%20O'Neill%2C%20Engineer",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "In my role as engineer, Retool started paying for itself once we were serious about speeding up workflows that had been blocked by manual setup, and Database connections solved the part of the workflow that kept creating follow-up work. Saved our team hundreds of hours on internal tool development. Low-code doesn't mean low-capability. Integrations are seamless. We were able to validate it under real volume before budget became the main conversation, and that changed the quality of the decision completely."
  },
  {
    "id": "retool-sophia-wong",
    "dealId": "retool",
    "author": "Sophia Wong",
    "role": "CTO",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia%20Wong%2C%20CTO",
    "rating": 4,
    "date": "2026-04-23",
    "quote": "We did not add Retool for vanity metrics; we added it because giving the team leverage without building more internal overhead needed a real fix, and Pre-built components library delivered that first. Fantastic for rapid prototyping. Learning curve is minimal. Some advanced customization requires code. The learning curve was manageable compared with the time it saves now, which is why it remained part of the stack."
  },
  {
    "id": "algolia-lauren-rodriguez",
    "dealId": "algolia",
    "author": "Lauren Rodriguez",
    "role": "Product Manager",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Lauren%20Rodriguez%2C%20Product%20Manager",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "As product manager, Algolia started paying for itself once we were serious about removing repetitive engineering work from weekly operations, and Mobile-friendly results solved the part of the workflow that kept creating follow-up work. Algolia's search is incredibly fast. Users love the autocomplete. The $10K credits covered our search needs for a year. We were able to validate it under real volume before budget became the main conversation, and that changed the quality of the decision completely."
  },
  {
    "id": "algolia-ravi-patel",
    "dealId": "algolia",
    "author": "Ravi Patel",
    "role": "Frontend Engineer",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Ravi%20Patel%2C%20Frontend%20Engineer",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "By the time we rolled out Algolia, giving the team leverage without building more internal overhead was already slowing us down, and Lightning-fast search API gave us a cleaner operating rhythm almost immediately. Integration was surprisingly easy. Search quality is exceptional. Typo tolerance impresses users. It is one of the few startup perks we kept without much debate because the operational payoff showed up in the first month, not six months later."
  },
  {
    "id": "algolia-emma-foster",
    "dealId": "algolia",
    "author": "Emma Foster",
    "role": "CEO",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma%20Foster%2C%20CEO",
    "rating": 4,
    "date": "2026-04-23",
    "quote": "The reason Algolia stuck for us is that it helped with giving the team leverage without building more internal overhead without turning setup into another side project, especially around Lightning-fast search API. Transformed how users discover our products. Learning the API takes time but documentation helps. Even with some setup overhead, it delivered enough practical value that we kept expanding how we use it."
  },
  {
    "id": "github-dr-christopher-lang",
    "dealId": "github",
    "author": "Dr. Christopher Lang",
    "role": "Engineering Manager",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Dr.%20Christopher%20Lang%2C%20Engineering%20Manager",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "We tested GitHub because we were tired of losing time to removing repetitive engineering work from weekly operations, and Security scanning made the value obvious much faster than I expected. GitHub Enterprise seats transformed our collaboration. GitHub Actions simplified our CI/CD significantly. Security features are comprehensive. It ended up removing more follow-up and cleanup work than I expected, which is what makes the savings feel tangible."
  },
  {
    "id": "github-alice-thompson",
    "dealId": "github",
    "author": "Alice Thompson",
    "role": "DevOps Lead",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice%20Thompson%2C%20DevOps%20Lead",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "By the time we rolled out GitHub, giving the team leverage without building more internal overhead was already slowing us down, and 20 free Enterprise seats gave us a cleaner operating rhythm almost immediately. 20 free seats covered our entire team. Actions automated our deployment pipeline. Code review process is smooth. It is one of the few startup perks we kept without much debate because the operational payoff showed up in the first month, not six months later."
  },
  {
    "id": "github-marcus-johnson",
    "dealId": "github",
    "author": "Marcus Johnson",
    "role": "Founder",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus%20Johnson%2C%20Founder",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "We did not add GitHub for vanity metrics; we added it because speeding up workflows that had been blocked by manual setup needed a real fix, and Approximately $4,500 in value delivered that first. GitHub is where our team lives. Integration with other tools is seamless. Support is professional. That mix of measurable ROI and low friction is why we kept it in the stack after the offer period instead of treating it like a temporary experiment."
  },
  {
    "id": "bastion-dr-raj-kumar",
    "dealId": "bastion",
    "author": "Dr. Raj Kumar",
    "role": "Security Officer",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Dr.%20Raj%20Kumar%2C%20Security%20Officer",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "As security officer, Bastion started paying for itself once we were serious about tightening risk posture before bigger customer audits, and Audit trail maintenance solved the part of the workflow that kept creating follow-up work. Bastion made SOC 2 compliance straightforward. The 20% discount was appreciated. Now we can pursue enterprise deals with confidence. We were able to validate it under real volume before budget became the main conversation, and that changed the quality of the decision completely."
  },
  {
    "id": "bastion-jennifer-chen",
    "dealId": "bastion",
    "author": "Jennifer Chen",
    "role": "Founder",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Jennifer%20Chen%2C%20Founder",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "By the time we rolled out Bastion, making security reviews less painful for a small team was already slowing us down, and Policy templates gave us a cleaner operating rhythm almost immediately. Without Bastion, SOC 2 would have taken months. Clear guidance and templates accelerated everything. Worth every penny. It is one of the few startup perks we kept without much debate because the operational payoff showed up in the first month, not six months later."
  },
  {
    "id": "bastion-tom-bradley",
    "dealId": "bastion",
    "author": "Tom Bradley",
    "role": "CTO",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Tom%20Bradley%2C%20CTO",
    "rating": 4,
    "date": "2026-04-23",
    "quote": "As cto, Bastion started paying for itself once we were serious about tightening risk posture before bigger customer audits, and Audit trail maintenance solved the part of the workflow that kept creating follow-up work. Simplified compliance significantly. Some processes require detailed setup. Support team is knowledgeable. It took a bit of iteration to get the workflow dialed in, but the result was strong enough that nobody wanted to go back."
  },
  {
    "id": "notion-priya-sharma",
    "dealId": "notion",
    "author": "Priya Sharma",
    "role": "Product Manager",
    "company": "TechScale Inc",
    "avatar": "/assets/testimonials/women-2.jpg",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "What pushed us toward Notion was the need to get better at cutting down handoff time across a remote team, and API handled the exact part of the process that had become messy. Notion has completely transformed how our team manages projects. With PerksNest's deal, we get 6 months free to consolidate all our scattered documentation and workflows into one beautiful workspace. The AI assistant alone saves us hours every week. The biggest win was how quickly the team trusted it once it was live, which is why notion for Startups felt like real leverage and not just a headline discount."
  },
  {
    "id": "notion-michael-torres",
    "dealId": "notion",
    "author": "Michael Torres",
    "role": "Operations Director",
    "company": "Growth Tech Solutions",
    "avatar": "/assets/testimonials/men-5.jpg",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "We brought Notion in when keeping cross-functional work visible without five disconnected tools was becoming a weekly problem, and Version history was the first part of the rollout that made the team stop second-guessing the switch. We switched our entire knowledge base to Notion using the PerksNest discount. The database templates and automation features have made onboarding new team members 3x faster. Best investment we've made. The tool stuck because it improved day-to-day execution, not because it looked good in onboarding or vendor calls."
  },
  {
    "id": "notion-sarah-anderson",
    "dealId": "notion",
    "author": "Sarah Anderson",
    "role": "Team Lead",
    "company": "Creative Agency Hub",
    "avatar": "/assets/testimonials/men-10.jpg",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "By the time we rolled out Notion, keeping cross-functional work visible without five disconnected tools was already slowing us down, and 6 months free Pro access gave us a cleaner operating rhythm almost immediately. Notion's flexibility is unmatched. We created custom project trackers, client databases, and internal wikis all in one platform. The PerksNest deal saved us thousands in comparison to other tools. It is one of the few startup perks we kept without much debate because the operational payoff showed up in the first month, not six months later."
  },
  {
    "id": "notion-rajesh-kumar",
    "dealId": "notion",
    "author": "Rajesh Kumar",
    "role": "Founder",
    "company": "StartUp Ventures",
    "avatar": "/assets/testimonials/men-6.jpg",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "We did not add Notion for vanity metrics; we added it because giving the team one operating system for process and context needed a real fix, and Team management delivered that first. Our entire startup runs on Notion now. From HR records to product roadmap to financial tracking. The 6-month free period allowed us to fully test and commit without risk. That mix of measurable ROI and low friction is why we kept it in the stack after the offer period instead of treating it like a temporary experiment."
  },
  {
    "id": "notion-emma-wilson",
    "dealId": "notion",
    "author": "Emma Wilson",
    "role": "Project Coordinator",
    "company": "Digital Solutions Co",
    "avatar": "/assets/testimonials/women-7.jpg",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "We brought Notion in when giving the team one operating system for process and context was becoming a weekly problem, and Document collaboration was the first part of the rollout that made the team stop second-guessing the switch. The collaboration features in Notion are incredible. Real-time editing, comments, and permissions made remote team management seamless. PerksNest's offer was the perfect entry point. The tool stuck because it improved day-to-day execution, not because it looked good in onboarding or vendor calls."
  },
  {
    "id": "miro-isabella-romano",
    "dealId": "miro",
    "author": "Isabella Romano",
    "role": "Design Lead",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Isabella%20Romano%2C%20Design%20Lead",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "We brought Miro in when giving the team one operating system for process and context was becoming a weekly problem, and Wireframing features was the first part of the rollout that made the team stop second-guessing the switch. Miro transformed our design brainstorming. Remote collaboration works seamlessly. The $1K credits covered our annual usage. The tool stuck because it improved day-to-day execution, not because it looked good in onboarding or vendor calls."
  },
  {
    "id": "miro-noah-cooper",
    "dealId": "miro",
    "author": "Noah Cooper",
    "role": "Product Manager",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Noah%20Cooper%2C%20Product%20Manager",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "We did not add Miro for vanity metrics; we added it because giving the team one operating system for process and context needed a real fix, and Wireframing features delivered that first. Used Miro for user flows, roadmaps, and wireframes. Infinite canvas is perfect. Templates accelerated our planning. That mix of measurable ROI and low friction is why we kept it in the stack after the offer period instead of treating it like a temporary experiment."
  },
  {
    "id": "miro-zara-patel",
    "dealId": "miro",
    "author": "Zara Patel",
    "role": "UX Designer",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Zara%20Patel%2C%20UX%20Designer",
    "rating": 4,
    "date": "2026-04-23",
    "quote": "From a ux designer perspective, Miro started paying for itself once we were serious about keeping cross-functional work visible without five disconnected tools, and Templates library solved the part of the workflow that kept creating follow-up work. Great collaboration tool. Performance on large boards can be sluggish. Worth it for team workflows. It took a bit of iteration to get the workflow dialed in, but the result was strong enough that nobody wanted to go back."
  },
  {
    "id": "linear-daniel-kim",
    "dealId": "linear",
    "author": "Daniel Kim",
    "role": "Engineering Manager",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Daniel%20Kim%2C%20Engineering%20Manager",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "By the time we rolled out Linear, giving the team leverage without building more internal overhead was already slowing us down, and 6 months free subscription gave us a cleaner operating rhythm almost immediately. Linear's speed transformed our workflow. The 6-month free access let the team experience the productivity boost. We're now a paying customer. It is one of the few startup perks we kept without much debate because the operational payoff showed up in the first month, not six months later."
  },
  {
    "id": "linear-grace-wu",
    "dealId": "linear",
    "author": "Grace Wu",
    "role": "Technical Lead",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Grace%20Wu%2C%20Technical%20Lead",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "By the time we rolled out Linear, removing repetitive engineering work from weekly operations was already slowing us down, and API gave us a cleaner operating rhythm almost immediately. Issue management was never this smooth. Automation features saved us from repetitive tasks. Team loves the interface. It is one of the few startup perks we kept without much debate because the operational payoff showed up in the first month, not six months later."
  },
  {
    "id": "linear-hassan-mohamed",
    "dealId": "linear",
    "author": "Hassan Mohamed",
    "role": "Developer",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Hassan%20Mohamed%2C%20Developer",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "We brought Linear in when speeding up workflows that had been blocked by manual setup was becoming a weekly problem, and GitHub integration was the first part of the rollout that made the team stop second-guessing the switch. Best project management tool for engineers. No fluff, just what we need. GitHub integration is perfect. The tool stuck because it improved day-to-day execution, not because it looked good in onboarding or vendor calls."
  },
  {
    "id": "atlassian-rebecca-foster",
    "dealId": "atlassian",
    "author": "Rebecca Foster",
    "role": "Scrum Master",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Rebecca%20Foster%2C%20Scrum%20Master",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "What pushed us toward Atlassian was the need to get better at speeding up workflows that had been blocked by manual setup, and CI/CD handled the exact part of the process that had become messy. Jira and Confluence together transformed our team organization. The startup discount was substantial. Automation rules save us time daily. The biggest win was how quickly the team trusted it once it was live, which is why community license free felt like real leverage and not just a headline discount."
  },
  {
    "id": "atlassian-leo-martinez",
    "dealId": "atlassian",
    "author": "Leo Martinez",
    "role": "Developer",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Leo%20Martinez%2C%20Developer",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "By the time we rolled out Atlassian, giving the team leverage without building more internal overhead was already slowing us down, and Confluence gave us a cleaner operating rhythm almost immediately. Bitbucket integration with Jira is seamless. Pipelines simplified our CI/CD setup. Team loves the integration. It is one of the few startup perks we kept without much debate because the operational payoff showed up in the first month, not six months later."
  },
  {
    "id": "atlassian-yasmin-hassan",
    "dealId": "atlassian",
    "author": "Yasmin Hassan",
    "role": "Engineering Lead",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Yasmin%20Hassan%2C%20Engineering%20Lead",
    "rating": 4,
    "date": "2026-04-23",
    "quote": "We brought Atlassian in when removing repetitive engineering work from weekly operations was becoming a weekly problem, and Up to $10,000 in value was the first part of the rollout that made the team stop second-guessing the switch. Comprehensive toolset. Can be overwhelming initially. Learning curve worth the investment. There are still edges to smooth out, yet the benefit is obvious enough in weekly operations that it earned its place."
  },
  {
    "id": "whimsical-olivia-green",
    "dealId": "whimsical",
    "author": "Olivia Green",
    "role": "UX Designer",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Olivia%20Green%2C%20UX%20Designer",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "We brought Whimsical in when collaborating on visual work without version chaos was becoming a weekly problem, and Flowchart creation was the first part of the rollout that made the team stop second-guessing the switch. Whimsical's wireframing is faster than Figma for quick concepts. The 12-month free access was perfect. Team loves the interface. The tool stuck because it improved day-to-day execution, not because it looked good in onboarding or vendor calls."
  },
  {
    "id": "whimsical-connor-roberts",
    "dealId": "whimsical",
    "author": "Connor Roberts",
    "role": "Product Manager",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Connor%20Roberts%2C%20Product%20Manager",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "We brought Whimsical in when collaborating on visual work without version chaos was becoming a weekly problem, and Flowchart creation was the first part of the rollout that made the team stop second-guessing the switch. Used Whimsical for user flows and feature planning. Real-time collaboration works beautifully. Templates are well-designed. The tool stuck because it improved day-to-day execution, not because it looked good in onboarding or vendor calls."
  },
  {
    "id": "whimsical-mia-petrov",
    "dealId": "whimsical",
    "author": "Mia Petrov",
    "role": "CTO",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Mia%20Petrov%2C%20CTO",
    "rating": 4,
    "date": "2026-04-23",
    "quote": "We brought Whimsical in when collaborating on visual work without version chaos was becoming a weekly problem, and Export to multiple formats was the first part of the rollout that made the team stop second-guessing the switch. Great for quick visual planning. Less feature-rich than design tools but perfect for what we need. There are still edges to smooth out, yet the benefit is obvious enough in weekly operations that it earned its place."
  },
  {
    "id": "lightfield-crm-julia-torres",
    "dealId": "lightfield-crm",
    "author": "Julia Torres",
    "role": "Sales Manager",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Julia%20Torres%2C%20Sales%20Manager",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "We tested Lightfield CRM because we were tired of losing time to getting sales and marketing into the same operating rhythm, and Mobile access made the value obvious much faster than I expected. Lightfield's simplicity is perfect for our startup stage. The 6-month free trial was generous. Pipeline tracking keeps us organized. It ended up removing more follow-up and cleanup work than I expected, which is what makes the savings feel tangible."
  },
  {
    "id": "lightfield-crm-kevin-murphy",
    "dealId": "lightfield-crm",
    "author": "Kevin Murphy",
    "role": "Founder",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Kevin%20Murphy%2C%20Founder",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "From a founder perspective, Lightfield CRM started paying for itself once we were serious about making pipeline visibility reliable enough to manage against, and Sales pipeline tracking solved the part of the workflow that kept creating follow-up work. No CRM bloat, just what we need. Interface is intuitive. Team was productive in days not weeks. We were able to validate it under real volume before budget became the main conversation, and that changed the quality of the decision completely."
  },
  {
    "id": "lightfield-crm-priya-singh",
    "dealId": "lightfield-crm",
    "author": "Priya Singh",
    "role": "VP Sales",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya%20Singh%2C%20VP%20Sales",
    "rating": 4,
    "date": "2026-04-23",
    "quote": "Our team adopted Lightfield CRM at the point where getting sales and marketing into the same operating rhythm was already affecting execution, and Mobile access changed the workflow more than the vendor pitch did. Good CRM for startups. Limited customization. Good enough for our current stage. There is still a little tuning involved, but the day-to-day workflow is better enough that we kept it after the initial trial."
  },
  {
    "id": "canva-monica-chen",
    "dealId": "canva",
    "author": "Monica Chen",
    "role": "Marketing Lead",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Monica%20Chen%2C%20Marketing%20Lead",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "We did not add Canva for vanity metrics; we added it because collaborating on visual work without version chaos needed a real fix, and Content calendar delivered that first. Canva made us look professional without hiring designers. The startup discount means amazing ROI. Templates saved so much time. That mix of measurable ROI and low friction is why we kept it in the stack after the offer period instead of treating it like a temporary experiment."
  },
  {
    "id": "canva-alex-patel",
    "dealId": "canva",
    "author": "Alex Patel",
    "role": "Founder",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex%20Patel%2C%20Founder",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "The reason Canva stuck for us is that it helped with collaborating on visual work without version chaos without turning setup into another side project, especially around Drag-and-drop editor. Non-designers can create beautiful materials. Brand kit ensures consistency. AI magic feature is impressive. Once the workflow was in place, the team stopped working around the process and actually started relying on it."
  },
  {
    "id": "canva-samara-williams",
    "dealId": "canva",
    "author": "Samara Williams",
    "role": "Content Manager",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Samara%20Williams%2C%20Content%20Manager",
    "rating": 4,
    "date": "2026-04-23",
    "quote": "We brought Canva in when improving handoff quality between design and engineering was becoming a weekly problem, and Video editing was the first part of the rollout that made the team stop second-guessing the switch. Great design tool for non-designers. Professional designers might find it limiting. Perfect for our stage. There are still edges to smooth out, yet the benefit is obvious enough in weekly operations that it earned its place."
  },
  {
    "id": "intercom-melissa-hart",
    "dealId": "intercom",
    "author": "Melissa Hart",
    "role": "Customer Success Manager",
    "company": "SaaS Innovations",
    "avatar": "/assets/testimonials/women-2.jpg",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "We tested Intercom because we were tired of losing time to reducing context loss across meetings and follow-up, and Team collaboration made the value obvious much faster than I expected. Intercom's customer messaging platform transformed our support. The free year on Advanced helped us deliver exceptional customer experiences that directly increased retention. It ended up removing more follow-up and cleanup work than I expected, which is what makes the savings feel tangible."
  },
  {
    "id": "intercom-raj-patel",
    "dealId": "intercom",
    "author": "Raj Patel",
    "role": "Support Director",
    "company": "SaaS Platform",
    "avatar": "/assets/testimonials/men-10.jpg",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "We tested Intercom because we were tired of losing time to standardizing collaboration across distributed teams, and Team collaboration made the value obvious much faster than I expected. We automated 70% of our customer support responses using Intercom's AI. The PerksNest credit covered the setup and training. Support costs dropped 40%. It ended up removing more follow-up and cleanup work than I expected, which is what makes the savings feel tangible."
  },
  {
    "id": "intercom-nina-anderson",
    "dealId": "intercom",
    "author": "Nina Anderson",
    "role": "Product Manager",
    "company": "B2B SaaS",
    "avatar": "/assets/testimonials/women-7.jpg",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "Our team adopted Intercom at the point where standardizing collaboration across distributed teams was already affecting execution, and Mobile app changed the workflow more than the vendor pitch did. Intercom's targeted campaigns to specific user segments improved our onboarding completion rate by 25%. The PerksNest deal let us implement it quickly. What made it easy to keep after the trial was that early stage plan gave us enough room to test it on a live workflow instead of judging it from a polished demo."
  },
  {
    "id": "intercom-hassan-ahmed",
    "dealId": "intercom",
    "author": "Hassan Ahmed",
    "role": "VP Customer Success",
    "company": "Startup",
    "avatar": "/assets/testimonials/men-6.jpg",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "We did not add Intercom for vanity metrics; we added it because reducing context loss across meetings and follow-up needed a real fix, and In-app messaging delivered that first. We use Intercom for customer support, onboarding, and product announcements. The PerksNest credit covered everything for a year. That mix of measurable ROI and low friction is why we kept it in the stack after the offer period instead of treating it like a temporary experiment."
  },
  {
    "id": "intercom-rebecca-foster",
    "dealId": "intercom",
    "author": "Rebecca Foster",
    "role": "Customer Experience Lead",
    "company": "Tech Company",
    "avatar": "/assets/testimonials/women-7.jpg",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "The reason Intercom stuck for us is that it helped with reducing context loss across meetings and follow-up without turning setup into another side project, especially around Knowledge base. Intercom's beautiful chat widget and messaging system improved our Net Promoter Score by 15 points. The PerksNest year-free deal was amazing. Once the workflow was in place, the team stopped working around the process and actually started relying on it."
  },
  {
    "id": "hubspot-elena-gonzalez",
    "dealId": "hubspot",
    "author": "Elena Gonzalez",
    "role": "Sales Manager",
    "company": "Enterprise Solutions Ltd",
    "avatar": "/assets/testimonials/women-4.jpg",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "The reason HubSpot stuck for us is that it helped with reducing admin around leads, follow-ups, and reporting without turning setup into another side project, especially around Email campaigns. HubSpot CRM unified our sales and marketing teams perfectly. The 30% discount for a year gave us runway to prove ROI before the full investment. It's been worth every penny. Once the workflow was in place, the team stopped working around the process and actually started relying on it."
  },
  {
    "id": "hubspot-thomas-mueller",
    "dealId": "hubspot",
    "author": "Thomas Mueller",
    "role": "VP Sales",
    "company": "B2B Company",
    "avatar": "/assets/testimonials/men-9.jpg",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "We did not add HubSpot for vanity metrics; we added it because getting sales and marketing into the same operating rhythm needed a real fix, and Approximately $7,000 in value delivered that first. The HubSpot onboarding workflow templates saved us months of setup. Combined with PerksNest's discount, we had a CRM deployed in 2 weeks instead of 3 months. That mix of measurable ROI and low friction is why we kept it in the stack after the offer period instead of treating it like a temporary experiment."
  },
  {
    "id": "hubspot-maria-santos",
    "dealId": "hubspot",
    "author": "Maria Santos",
    "role": "Sales Operations",
    "company": "Growth Agency",
    "avatar": "/assets/testimonials/women-5.jpg",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "Working as sales operations at Growth Agency, HubSpot started paying for itself once we were serious about reducing admin around leads, follow-ups, and reporting, and CRM database solved the part of the workflow that kept creating follow-up work. HubSpot's reporting helped us understand our sales pipeline for the first time. The PerksNest discount meant we could invest in training and adoption. We were able to validate it under real volume before budget became the main conversation, and that changed the quality of the decision completely."
  },
  {
    "id": "hubspot-john-peterson",
    "dealId": "hubspot",
    "author": "John Peterson",
    "role": "VP Operations",
    "company": "Tech Services",
    "avatar": "/assets/testimonials/men-8.jpg",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "By the time we rolled out HubSpot, getting sales and marketing into the same operating rhythm was already slowing us down, and Approximately $7,000 in value gave us a cleaner operating rhythm almost immediately. We replaced Salesforce with HubSpot using the PerksNest deal. Simpler interface, better support, and 50% lower cost. Our sales team is happier too. It is one of the few startup perks we kept without much debate because the operational payoff showed up in the first month, not six months later."
  },
  {
    "id": "hubspot-susan-martinez",
    "dealId": "hubspot",
    "author": "Susan Martinez",
    "role": "Sales Director",
    "company": "Enterprise Software",
    "avatar": "/assets/testimonials/men-3.jpg",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "Working as sales director at Enterprise Software, HubSpot started paying for itself once we were serious about reducing admin around leads, follow-ups, and reporting, and CRM database solved the part of the workflow that kept creating follow-up work. HubSpot's email tracking and sequences improved our response rates by 35%. The PerksNest discount covered the tool cost and then some from improved sales. We were able to validate it under real volume before budget became the main conversation, and that changed the quality of the decision completely."
  },
  {
    "id": "zendesk-michelle-zhang",
    "dealId": "zendesk",
    "author": "Michelle Zhang",
    "role": "Support Manager",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Michelle%20Zhang%2C%20Support%20Manager",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "Our team adopted Zendesk at the point where handling higher ticket volume without making the team feel underwater was already affecting execution, and Team collaboration changed the workflow more than the vendor pitch did. Zendesk organized our support process. The 6-month free access gave time to prove value. Customers appreciate the responsiveness. What made it easy to keep after the trial was that startup program benefits gave us enough room to test it on a live workflow instead of judging it from a polished demo."
  },
  {
    "id": "zendesk-chris-bailey",
    "dealId": "zendesk",
    "author": "Chris Bailey",
    "role": "Founder",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Chris%20Bailey%2C%20Founder",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "The reason Zendesk stuck for us is that it helped with handling higher ticket volume without making the team feel underwater without turning setup into another side project, especially around Chat and messaging. Scaling support without hiring dozens of people. Automation handles repetitive issues. Multi-channel support is seamless. Once the workflow was in place, the team stopped working around the process and actually started relying on it."
  },
  {
    "id": "zendesk-amanda-foster",
    "dealId": "zendesk",
    "author": "Amanda Foster",
    "role": "Customer Support Lead",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Amanda%20Foster%2C%20Customer%20Support%20Lead",
    "rating": 4,
    "date": "2026-04-23",
    "quote": "We brought Zendesk in when reducing repeat work in support operations was becoming a weekly problem, and Knowledge base was the first part of the rollout that made the team stop second-guessing the switch. Excellent support platform. Setup and configuration takes planning. Once configured, workflow is efficient. There are still edges to smooth out, yet the benefit is obvious enough in weekly operations that it earned its place."
  },
  {
    "id": "salesforce-dr-richard-thompson",
    "dealId": "salesforce",
    "author": "Dr. Richard Thompson",
    "role": "Chief Revenue Officer",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Dr.%20Richard%20Thompson%2C%20Chief%20Revenue%20Officer",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "Our team adopted Salesforce at the point where getting sales and marketing into the same operating rhythm was already affecting execution, and Sales cloud platform changed the workflow more than the vendor pitch did. Salesforce's CRM capabilities are unmatched. Customization lets us build our exact workflows. Startup pricing made adoption easy. What made it easy to keep after the trial was that startup program gave us enough room to test it on a live workflow instead of judging it from a polished demo."
  },
  {
    "id": "salesforce-natasha-petrov",
    "dealId": "salesforce",
    "author": "Natasha Petrov",
    "role": "Sales Director",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Natasha%20Petrov%2C%20Sales%20Director",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "What pushed us toward Salesforce was the need to get better at reducing admin around leads, follow-ups, and reporting, and Marketing automation handled the exact part of the process that had become messy. Scaling sales team required CRM that could grow with us. Salesforce delivered. Reporting capabilities are exceptional. The biggest win was how quickly the team trusted it once it was live, which is why startup program felt like real leverage and not just a headline discount."
  },
  {
    "id": "salesforce-ethan-brooks",
    "dealId": "salesforce",
    "author": "Ethan Brooks",
    "role": "Implementation Lead",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Ethan%20Brooks%2C%20Implementation%20Lead",
    "rating": 4,
    "date": "2026-04-23",
    "quote": "By the time we rolled out Salesforce, making pipeline visibility reliable enough to manage against was already slowing us down, and Marketing automation gave us a cleaner operating rhythm almost immediately. Powerful platform but complex. Implementation requires planning. Salesforce support is professional. We had to refine the setup a bit, but the improvement in execution was real and easy to defend internally."
  },
  {
    "id": "stripe-atlas-liu-zhang",
    "dealId": "stripe-atlas",
    "author": "Liu Zhang",
    "role": "International Founder",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Liu%20Zhang%2C%20International%20Founder",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "We tested Stripe Atlas because we were tired of losing time to keeping payments reliable while volume was climbing, and Banking infrastructure made the value obvious much faster than I expected. Atlas made establishing US presence effortless. Incorporation was painless. The $150K perks provided immediate value. It ended up removing more follow-up and cleanup work than I expected, which is what makes the savings feel tangible."
  },
  {
    "id": "stripe-atlas-sophia-anderson",
    "dealId": "stripe-atlas",
    "author": "Sophia Anderson",
    "role": "CEO",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia%20Anderson%2C%20CEO",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "Our team adopted Stripe Atlas at the point where reducing payment overhead before revenue fully caught up was already affecting execution, and Legal documentation changed the workflow more than the vendor pitch did. Comprehensive startup foundation service. Banking setup was quick. Access to quality partners through perks was valuable. What made it easy to keep after the trial was that company formation + credits gave us enough room to test it on a live workflow instead of judging it from a polished demo."
  },
  {
    "id": "stripe-atlas-marcus-johnson",
    "dealId": "stripe-atlas",
    "author": "Marcus Johnson",
    "role": "Founder",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus%20Johnson%2C%20Founder",
    "rating": 4,
    "date": "2026-04-23",
    "quote": "We did not add Stripe Atlas for vanity metrics; we added it because keeping payments reliable while volume was climbing needed a real fix, and Perks marketplace delivered that first. Great service for international founders. Some tax questions required additional consultation. Overall highly valuable. The learning curve was manageable compared with the time it saves now, which is why it remained part of the stack."
  },
  {
    "id": "brex-vanessa-torres",
    "dealId": "brex",
    "author": "Vanessa Torres",
    "role": "CFO",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Vanessa%20Torres%2C%20CFO",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "Our team adopted Brex at the point where reducing approval and reconciliation work that used to sit in spreadsheets was already affecting execution, and Curated startup perks changed the workflow more than the vendor pitch did. Brex corporate card simplified our spending management. Startup perks provided immediate value. Team loves the receipt capture. What made it easy to keep after the trial was that business card & banking gave us enough room to test it on a live workflow instead of judging it from a polished demo."
  },
  {
    "id": "brex-kevin-zhang",
    "dealId": "brex",
    "author": "Kevin Zhang",
    "role": "Finance Manager",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Kevin%20Zhang%2C%20Finance%20Manager",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "We did not add Brex for vanity metrics; we added it because reducing approval and reconciliation work that used to sit in spreadsheets needed a real fix, and Virtual card numbers delivered that first. Integration with accounting software was seamless. Cash back adds up. Spending controls give finance team visibility. That mix of measurable ROI and low friction is why we kept it in the stack after the offer period instead of treating it like a temporary experiment."
  },
  {
    "id": "brex-rachel-green",
    "dealId": "brex",
    "author": "Rachel Green",
    "role": "Founder",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Rachel%20Green%2C%20Founder",
    "rating": 4,
    "date": "2026-04-23",
    "quote": "We tested Brex because we were tired of losing time to giving finance enough visibility without slowing operators down, and Corporate card benefits made the value obvious much faster than I expected. Great financial infrastructure. Rewards are valuable. Application process was thorough. The rollout needed some refinement, but once we got through that, the gains were clear in real work."
  },
  {
    "id": "ramp-dr-ananya-patel",
    "dealId": "ramp",
    "author": "Dr. Ananya Patel",
    "role": "CFO",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Dr.%20Ananya%20Patel%2C%20CFO",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "What pushed us toward Ramp was the need to get better at giving finance enough visibility without slowing operators down, and Fraud detection handled the exact part of the process that had become messy. Ramp's expense management saved our finance team hours monthly. Startup perks provide ongoing value. Fraud detection gives peace of mind. The biggest win was how quickly the team trusted it once it was live, which is why startup benefits felt like real leverage and not just a headline discount."
  },
  {
    "id": "ramp-james-wilson",
    "dealId": "ramp",
    "author": "James Wilson",
    "role": "Finance Lead",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=James%20Wilson%2C%20Finance%20Lead",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "By the time we rolled out Ramp, making spend control and month-end cleaner was already slowing us down, and Team expense policies gave us a cleaner operating rhythm almost immediately. Automated expense reports changed our workflow. Integration with accounting was smooth. Team loves the ease of use. It is one of the few startup perks we kept without much debate because the operational payoff showed up in the first month, not six months later."
  },
  {
    "id": "ramp-sophie-chen",
    "dealId": "ramp",
    "author": "Sophie Chen",
    "role": "Founder",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie%20Chen%2C%20Founder",
    "rating": 4,
    "date": "2026-04-23",
    "quote": "By the time we rolled out Ramp, making spend control and month-end cleaner was already slowing us down, and Real-time spend controls gave us a cleaner operating rhythm almost immediately. Great financial infrastructure tool. Learning the dashboard takes time. Support team is helpful. We had to refine the setup a bit, but the improvement in execution was real and easy to defend internally."
  },
  {
    "id": "revolut-business-henrik-larson",
    "dealId": "revolut-business",
    "author": "Henrik Larson",
    "role": "International Founder",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Henrik%20Larson%2C%20International%20Founder",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "The reason Revolut Business stuck for us is that it helped with making spend control and month-end cleaner without turning setup into another side project, especially around Business cards. Revolut Business solved our multi-currency needs. The 6-month free plan was perfect for setup. Fees are competitive. Once the workflow was in place, the team stopped working around the process and actually started relying on it."
  },
  {
    "id": "revolut-business-mei-chen",
    "dealId": "revolut-business",
    "author": "Mei Chen",
    "role": "CFO",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Mei%20Chen%2C%20CFO",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "We tested Revolut Business because we were tired of losing time to making spend control and month-end cleaner, and Team controls made the value obvious much faster than I expected. International payments are smooth. Exchange rates are excellent. Team card management is flexible. It ended up removing more follow-up and cleanup work than I expected, which is what makes the savings feel tangible."
  },
  {
    "id": "revolut-business-stefan-mueller",
    "dealId": "revolut-business",
    "author": "Stefan Mueller",
    "role": "Finance Manager",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Stefan%20Mueller%2C%20Finance%20Manager",
    "rating": 4,
    "date": "2026-04-23",
    "quote": "We tested Revolut Business because we were tired of losing time to reducing approval and reconciliation work that used to sit in spreadsheets, and Competitive exchange rates made the value obvious much faster than I expected. Great for international teams. Support could be faster. Overall very satisfied with service. The rollout needed some refinement, but once we got through that, the gains were clear in real work."
  },
  {
    "id": "gusto-rebecca-williams",
    "dealId": "gusto",
    "author": "Rebecca Williams",
    "role": "HR Manager",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Rebecca%20Williams%2C%20HR%20Manager",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "What pushed us toward Gusto was the need to get better at supporting a distributed team without brittle HR operations, and Direct deposit handled the exact part of the process that had become messy. Gusto simplified our first payroll runs. Compliance handling gave us peace of mind. The startup discount was appreciated. The biggest win was how quickly the team trusted it once it was live, which is why startup program felt like real leverage and not just a headline discount."
  },
  {
    "id": "gusto-michael-chang",
    "dealId": "gusto",
    "author": "Michael Chang",
    "role": "Founder",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael%20Chang%2C%20Founder",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "We tested Gusto because we were tired of losing time to supporting a distributed team without brittle HR operations, and Employee onboarding made the value obvious much faster than I expected. Didn't have to hire HR person thanks to Gusto. Benefits administration is simple. Tax compliance is handled. It ended up removing more follow-up and cleanup work than I expected, which is what makes the savings feel tangible."
  },
  {
    "id": "gusto-jessica-martinez",
    "dealId": "gusto",
    "author": "Jessica Martinez",
    "role": "Operations Lead",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica%20Martinez%2C%20Operations%20Lead",
    "rating": 4,
    "date": "2026-04-23",
    "quote": "What pushed us toward Gusto was the need to get better at supporting a distributed team without brittle HR operations, and Direct deposit handled the exact part of the process that had become messy. Great payroll solution. Some HR features could be more comprehensive. Support is helpful. It was not perfect on day one, although the underlying value showed up quickly enough that the team stayed with it."
  },
  {
    "id": "revsh-priya-sharma",
    "dealId": "revsh",
    "author": "Priya Sharma",
    "role": "Partnerships Manager",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya%20Sharma%2C%20Partnerships%20Manager",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "By the time we rolled out RevSh, giving finance enough visibility without slowing operators down was already slowing us down, and $1,000 grant and 25% discount gave us a cleaner operating rhythm almost immediately. RevSh made managing partner revenue splits transparent. The $1K grant and discount provided immediate value. It is one of the few startup perks we kept without much debate because the operational payoff showed up in the first month, not six months later."
  },
  {
    "id": "revsh-david-kim",
    "dealId": "revsh",
    "author": "David Kim",
    "role": "CFO",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=David%20Kim%2C%20CFO",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "We did not add RevSh for vanity metrics; we added it because making spend control and month-end cleaner needed a real fix, and Revenue sharing tools delivered that first. Automated payouts eliminated manual calculations. Reporting is transparent. Partners appreciate the clarity. That mix of measurable ROI and low friction is why we kept it in the stack after the offer period instead of treating it like a temporary experiment."
  },
  {
    "id": "revsh-elena-rossi",
    "dealId": "revsh",
    "author": "Elena Rossi",
    "role": "Co-Founder",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena%20Rossi%2C%20Co-Founder",
    "rating": 4,
    "date": "2026-04-23",
    "quote": "Our team adopted RevSh at the point where reducing approval and reconciliation work that used to sit in spreadsheets was already affecting execution, and Easy integration changed the workflow more than the vendor pitch did. Good partnership tool. Integration required some setup. Worth it for partnership clarity. There is still a little tuning involved, but the day-to-day workflow is better enough that we kept it after the initial trial."
  },
  {
    "id": "backblaze-dr-rajesh-patel",
    "dealId": "backblaze",
    "author": "Dr. Rajesh Patel",
    "role": "Data Engineer",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Dr.%20Rajesh%20Patel%2C%20Data%20Engineer",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "The reason Backblaze stuck for us is that it helped with making restore confidence part of the workflow instead of an afterthought without turning setup into another side project, especially around Cloud storage platform. Backblaze's $100K credits covered years of storage. Reliability and uptime have been exceptional. Cost per GB is excellent. Once the workflow was in place, the team stopped working around the process and actually started relying on it."
  },
  {
    "id": "backblaze-laura-chen",
    "dealId": "backblaze",
    "author": "Laura Chen",
    "role": "CTO",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Laura%20Chen%2C%20CTO",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "The reason Backblaze stuck for us is that it helped with getting backup operations reliable enough to ignore until needed without turning setup into another side project, especially around API. Storing petabytes of data reliably. Geographic redundancy gives peace of mind. API is straightforward. Once the workflow was in place, the team stopped working around the process and actually started relying on it."
  },
  {
    "id": "backblaze-marcus-green",
    "dealId": "backblaze",
    "author": "Marcus Green",
    "role": "Backend Engineer",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus%20Green%2C%20Backend%20Engineer",
    "rating": 4,
    "date": "2026-04-23",
    "quote": "What pushed us toward Backblaze was the need to get better at making restore confidence part of the workflow instead of an afterthought, and Geographic redundancy handled the exact part of the process that had become messy. Solid storage platform. Dashboard could be more intuitive. Support team is knowledgeable. It was not perfect on day one, although the underlying value showed up quickly enough that the team stayed with it."
  },
  {
    "id": "zoho-anita-desai",
    "dealId": "zoho",
    "author": "Anita Desai",
    "role": "Operations Manager",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Anita%20Desai%2C%20Operations%20Manager",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "We brought Zoho in when speeding up workflows that had been blocked by manual setup was becoming a weekly problem, and CRM platform was the first part of the rollout that made the team stop second-guessing the switch. Zoho suite provided all tools we needed without tool fragmentation. The 1-year free access was generous. Integration between tools is seamless. The tool stuck because it improved day-to-day execution, not because it looked good in onboarding or vendor calls."
  },
  {
    "id": "zoho-michael-park",
    "dealId": "zoho",
    "author": "Michael Park",
    "role": "Founder",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael%20Park%2C%20Founder",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "As founder, Zoho started paying for itself once we were serious about removing repetitive engineering work from weekly operations, and Team collaboration solved the part of the workflow that kept creating follow-up work. Consolidated 5 different tools into Zoho. Cost savings are significant. Learning each module takes time but worth it. We were able to validate it under real volume before budget became the main conversation, and that changed the quality of the decision completely."
  },
  {
    "id": "zoho-sophie-turner",
    "dealId": "zoho",
    "author": "Sophie Turner",
    "role": "Finance Lead",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie%20Turner%2C%20Finance%20Lead",
    "rating": 4,
    "date": "2026-04-23",
    "quote": "What pushed us toward Zoho was the need to get better at speeding up workflows that had been blocked by manual setup, and CRM platform handled the exact part of the process that had become messy. Good integrated suite. UI could be more polished. Support is responsive. It was not perfect on day one, although the underlying value showed up quickly enough that the team stayed with it."
  },
  {
    "id": "typeform-victoria-chen",
    "dealId": "typeform",
    "author": "Victoria Chen",
    "role": "Growth Manager",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Victoria%20Chen%2C%20Growth%20Manager",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "By the time we rolled out Typeform, running intake and research without spreadsheet cleanup was already slowing us down, and Mobile optimization gave us a cleaner operating rhythm almost immediately. Typeform forms converted better than standard HTML. The 75% discount made sophisticated lead gen affordable. Analytics are helpful. It is one of the few startup perks we kept without much debate because the operational payoff showed up in the first month, not six months later."
  },
  {
    "id": "typeform-alex-murphy",
    "dealId": "typeform",
    "author": "Alex Murphy",
    "role": "Product Manager",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex%20Murphy%2C%20Product%20Manager",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "We tested Typeform because we were tired of losing time to collecting higher-quality inputs without hurting conversion, and Quiz templates made the value obvious much faster than I expected. Beautiful survey experience. Customers love the interface. Integration with CRM was seamless. It ended up removing more follow-up and cleanup work than I expected, which is what makes the savings feel tangible."
  },
  {
    "id": "typeform-priya-gupta",
    "dealId": "typeform",
    "author": "Priya Gupta",
    "role": "Marketing Lead",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya%20Gupta%2C%20Marketing%20Lead",
    "rating": 4,
    "date": "2026-04-23",
    "quote": "We tested Typeform because we were tired of losing time to collecting higher-quality inputs without hurting conversion, and Up to 75% discount available made the value obvious much faster than I expected. Great form tool. Learning all features takes time. Worth investment for conversion rate. The rollout needed some refinement, but once we got through that, the gains were clear in real work."
  },
  {
    "id": "deel-sophia-garcia",
    "dealId": "deel",
    "author": "Sophia Garcia",
    "role": "People Lead",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia%20Garcia%2C%20People%20Lead",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "We tested Deel because we were tired of losing time to supporting a distributed team without brittle HR operations, and Compliance handling made the value obvious much faster than I expected. Deel made hiring internationally seamless. Compliance and tax handling is accurate. The startup discount saves thousands. It ended up removing more follow-up and cleanup work than I expected, which is what makes the savings feel tangible."
  },
  {
    "id": "deel-dr-james-patterson",
    "dealId": "deel",
    "author": "Dr. James Patterson",
    "role": "Global CTO",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Dr.%20James%20Patterson%2C%20Global%20CTO",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "We brought Deel in when supporting a distributed team without brittle HR operations was becoming a weekly problem, and Compliance handling was the first part of the rollout that made the team stop second-guessing the switch. Scaled team across 15 countries thanks to Deel. Payroll is automatic. Support team understands global hiring. The tool stuck because it improved day-to-day execution, not because it looked good in onboarding or vendor calls."
  },
  {
    "id": "deel-amelia-foster",
    "dealId": "deel",
    "author": "Amelia Foster",
    "role": "Operations Manager",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Amelia%20Foster%2C%20Operations%20Manager",
    "rating": 4,
    "date": "2026-04-23",
    "quote": "By the time we rolled out Deel, managing hiring and payroll across more locations was already slowing us down, and Tax documentation gave us a cleaner operating rhythm almost immediately. Great global hiring solution. Learning all features takes time. Documentation is comprehensive. We had to refine the setup a bit, but the improvement in execution was real and easy to defend internally."
  },
  {
    "id": "box-ai-dr-rebecca-montgomery",
    "dealId": "box-ai",
    "author": "Dr. Rebecca Montgomery",
    "role": "Enterprise CTO",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Dr.%20Rebecca%20Montgomery%2C%20Enterprise%20CTO",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "Our team adopted Box at the point where keeping documents searchable and organized as the team grew was already affecting execution, and Workflow automation changed the workflow more than the vendor pitch did. Box's enterprise tools and AI capabilities impressed our customers. GTM support accelerated sales. Benefits package was substantial. What made it easy to keep after the trial was that startup program gave us enough room to test it on a live workflow instead of judging it from a polished demo."
  },
  {
    "id": "box-ai-michael-torres",
    "dealId": "box-ai",
    "author": "Michael Torres",
    "role": "Solutions Engineer",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael%20Torres%2C%20Solutions%20Engineer",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "What pushed us toward Box was the need to get better at reducing friction around secure file collaboration, and Integration ecosystem handled the exact part of the process that had become messy. AI-powered search works exceptionally. Collaboration features are enterprise-grade. Customer adoption has been smooth. The biggest win was how quickly the team trusted it once it was live, which is why startup program felt like real leverage and not just a headline discount."
  },
  {
    "id": "box-ai-jennifer-chen",
    "dealId": "box-ai",
    "author": "Jennifer Chen",
    "role": "Product Manager",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Jennifer%20Chen%2C%20Product%20Manager",
    "rating": 4,
    "date": "2026-04-23",
    "quote": "In my role as product manager, Box started paying for itself once we were serious about reducing friction around secure file collaboration, and Cloud content storage solved the part of the workflow that kept creating follow-up work. Powerful enterprise platform. Learning all features takes time. Support is professional. It took a bit of iteration to get the workflow dialed in, but the result was strong enough that nobody wanted to go back."
  },
  {
    "id": "statsig-tom-harrison",
    "dealId": "statsig",
    "author": "Tom Harrison",
    "role": "Engineering Lead",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Tom%20Harrison%2C%20Engineering%20Lead",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "What pushed us toward Statsig was the need to get better at finding growth bottlenecks without waiting on analyst bandwidth, and API handled the exact part of the process that had become messy. Statsig's feature flags enable safe deployments. Experimentation framework accelerated our learning. The $50K credits covered 18 months. The biggest win was how quickly the team trusted it once it was live, which is why free pro plan felt like real leverage and not just a headline discount."
  },
  {
    "id": "statsig-maya-patel",
    "dealId": "statsig",
    "author": "Maya Patel",
    "role": "Product Manager",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Maya%20Patel%2C%20Product%20Manager",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "We brought Statsig in when making experimentation faster than reporting cleanup was becoming a weekly problem, and Metric analysis was the first part of the rollout that made the team stop second-guessing the switch. A/B testing framework is powerful. Metric analysis guides decisions. Dashboard is intuitive. The tool stuck because it improved day-to-day execution, not because it looked good in onboarding or vendor calls."
  },
  {
    "id": "statsig-lucas-santos",
    "dealId": "statsig",
    "author": "Lucas Santos",
    "role": "DevOps Engineer",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Lucas%20Santos%2C%20DevOps%20Engineer",
    "rating": 4,
    "date": "2026-04-23",
    "quote": "Our team adopted Statsig at the point where turning raw events into decisions the product team could actually trust was already affecting execution, and Real-time dashboards changed the workflow more than the vendor pitch did. Great feature flag platform. Learning analytics takes time. Worth investment for experimentation rigor. There is still a little tuning involved, but the day-to-day workflow is better enough that we kept it after the initial trial."
  },
  {
    "id": "circleci-dr-steven-lee",
    "dealId": "circleci",
    "author": "Dr. Steven Lee",
    "role": "DevOps Lead",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Dr.%20Steven%20Lee%2C%20DevOps%20Lead",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "We did not add CircleCI for vanity metrics; we added it because making build feedback fast enough for daily shipping needed a real fix, and Approximately $5,000 in value delivered that first. CircleCI automated our deployment process. The 400K free minutes eliminated build bottlenecks. Setup was straightforward. That mix of measurable ROI and low friction is why we kept it in the stack after the offer period instead of treating it like a temporary experiment."
  },
  {
    "id": "circleci-rachel-wu",
    "dealId": "circleci",
    "author": "Rachel Wu",
    "role": "Engineering Manager",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Rachel%20Wu%2C%20Engineering%20Manager",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "We brought CircleCI in when keeping releases steady as commit volume increased was becoming a weekly problem, and Integration was the first part of the rollout that made the team stop second-guessing the switch. Parallel builds dramatically reduced deployment time. GitHub integration is seamless. Team productivity increased. The tool stuck because it improved day-to-day execution, not because it looked good in onboarding or vendor calls."
  },
  {
    "id": "circleci-kevin-park",
    "dealId": "circleci",
    "author": "Kevin Park",
    "role": "Backend Engineer",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Kevin%20Park%2C%20Backend%20Engineer",
    "rating": 4,
    "date": "2026-04-23",
    "quote": "We brought CircleCI in when keeping releases steady as commit volume increased was becoming a weekly problem, and Build caching was the first part of the rollout that made the team stop second-guessing the switch. Solid CI/CD platform. Some advanced configuration takes learning. Documentation is helpful. There are still edges to smooth out, yet the benefit is obvious enough in weekly operations that it earned its place."
  },
  {
    "id": "scaleway-sophie-martin",
    "dealId": "scaleway",
    "author": "Sophie Martin",
    "role": "French Founder",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie%20Martin%2C%20French%20Founder",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "By the time we rolled out Scaleway, scaling customer traffic without constantly redesigning the stack was already slowing us down, and European data centers gave us a cleaner operating rhythm almost immediately. Scaleway's European focus and GDPR compliance were essential. The €36K credits covered infrastructure nicely. Performance is reliable. It is one of the few startup perks we kept without much debate because the operational payoff showed up in the first month, not six months later."
  },
  {
    "id": "scaleway-klaus-weber",
    "dealId": "scaleway",
    "author": "Klaus Weber",
    "role": "German CTO",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Klaus%20Weber%2C%20German%20CTO",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "By the time we rolled out Scaleway, scaling customer traffic without constantly redesigning the stack was already slowing us down, and Object storage gave us a cleaner operating rhythm almost immediately. Privacy and data sovereignty matter to us. Scaleway delivers. Pricing is more competitive than hyperscalers. It is one of the few startup perks we kept without much debate because the operational payoff showed up in the first month, not six months later."
  },
  {
    "id": "scaleway-alessandro-rossi",
    "dealId": "scaleway",
    "author": "Alessandro Rossi",
    "role": "DevOps Engineer",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Alessandro%20Rossi%2C%20DevOps%20Engineer",
    "rating": 4,
    "date": "2026-04-23",
    "quote": "The reason Scaleway stuck for us is that it helped with scaling customer traffic without constantly redesigning the stack without turning setup into another side project, especially around GDPR compliant. Good European alternative. Interface could be more polished. Support is responsive. Even with some setup overhead, it delivered enough practical value that we kept expanding how we use it."
  },
  {
    "id": "gitlab-dr-mikhail-sokolov",
    "dealId": "gitlab",
    "author": "Dr. Mikhail Sokolov",
    "role": "Engineering Manager",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Dr.%20Mikhail%20Sokolov%2C%20Engineering%20Manager",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "By the time we rolled out GitLab, removing repetitive engineering work from weekly operations was already slowing us down, and 1 year free Ultimate licenses gave us a cleaner operating rhythm almost immediately. GitLab's all-in-one platform eliminated tool fragmentation. The 1-year free Ultimate licenses were substantial. Security scanning catches issues early. It is one of the few startup perks we kept without much debate because the operational payoff showed up in the first month, not six months later."
  },
  {
    "id": "gitlab-yuki-tanaka",
    "dealId": "gitlab",
    "author": "Yuki Tanaka",
    "role": "DevOps Lead",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Yuki%20Tanaka%2C%20DevOps%20Lead",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "In my role as devops lead, GitLab started paying for itself once we were serious about speeding up workflows that had been blocked by manual setup, and Git repository hosting solved the part of the workflow that kept creating follow-up work. Pipelines are powerful and flexible. Container registry integration is seamless. Team productivity improved. We were able to validate it under real volume before budget became the main conversation, and that changed the quality of the decision completely."
  },
  {
    "id": "gitlab-carla-santos",
    "dealId": "gitlab",
    "author": "Carla Santos",
    "role": "Frontend Engineer",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Carla%20Santos%2C%20Frontend%20Engineer",
    "rating": 4,
    "date": "2026-04-23",
    "quote": "Our team adopted GitLab at the point where removing repetitive engineering work from weekly operations was already affecting execution, and Merge requests workflow changed the workflow more than the vendor pitch did. Comprehensive platform. Interface can be overwhelming. Learning all features takes time. There is still a little tuning involved, but the day-to-day workflow is better enough that we kept it after the initial trial."
  },
  {
    "id": "alchemy-dr-satoshi-kumar",
    "dealId": "alchemy",
    "author": "Dr. Satoshi Kumar",
    "role": "Blockchain Lead",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Dr.%20Satoshi%20Kumar%2C%20Blockchain%20Lead",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "We did not add Alchemy for vanity metrics; we added it because keeping blockchain infrastructure dependable during traffic swings needed a real fix, and Monitoring tools delivered that first. Alchemy eliminated blockchain infrastructure complexity. APIs are clean and well-documented. The Web3 credits covered development. That mix of measurable ROI and low friction is why we kept it in the stack after the offer period instead of treating it like a temporary experiment."
  },
  {
    "id": "alchemy-vitalik-chen",
    "dealId": "alchemy",
    "author": "Vitalik Chen",
    "role": "Smart Contract Developer",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Vitalik%20Chen%2C%20Smart%20Contract%20Developer",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "Our team adopted Alchemy at the point where reducing operational drag around on-chain product work was already affecting execution, and Enhanced APIs changed the workflow more than the vendor pitch did. Building Web3 apps is so much easier with Alchemy. Multi-chain support is excellent. Support team understands blockchain. What made it easy to keep after the trial was that startup credits gave us enough room to test it on a live workflow instead of judging it from a polished demo."
  },
  {
    "id": "alchemy-jade-morgan",
    "dealId": "alchemy",
    "author": "Jade Morgan",
    "role": "CTO",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Jade%20Morgan%2C%20CTO",
    "rating": 4,
    "date": "2026-04-23",
    "quote": "The reason Alchemy stuck for us is that it helped with shipping Web3 features without RPC instability without turning setup into another side project, especially around Node infrastructure. Great for Web3 development. Learning blockchain concepts is challenging. Alchemy's APIs help tremendously. Even with some setup overhead, it delivered enough practical value that we kept expanding how we use it."
  },
  {
    "id": "snowflake-dr-patricia-lewis",
    "dealId": "snowflake",
    "author": "Dr. Patricia Lewis",
    "role": "Data Science Lead",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Dr.%20Patricia%20Lewis%2C%20Data%20Science%20Lead",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "The reason Snowflake stuck for us is that it helped with scaling data workflows without creating more maintenance work without turning setup into another side project, especially around Cloud data warehouse. Snowflake's scalable architecture handled our growing data. The startup credits covered over a year of costs. Query performance is exceptional. Once the workflow was in place, the team stopped working around the process and actually started relying on it."
  },
  {
    "id": "snowflake-james-anderson",
    "dealId": "snowflake",
    "author": "James Anderson",
    "role": "Analytics Engineer",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=James%20Anderson%2C%20Analytics%20Engineer",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "We brought Snowflake in when keeping schema changes from slowing product work was becoming a weekly problem, and Approximately $20,000 in value was the first part of the rollout that made the team stop second-guessing the switch. SQL analytics at scale is powerful. Data sharing is a killer feature. Team productivity increased dramatically. The tool stuck because it improved day-to-day execution, not because it looked good in onboarding or vendor calls."
  },
  {
    "id": "snowflake-monica-zhang",
    "dealId": "snowflake",
    "author": "Monica Zhang",
    "role": "BI Lead",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Monica%20Zhang%2C%20BI%20Lead",
    "rating": 4,
    "date": "2026-04-23",
    "quote": "We tested Snowflake because we were tired of losing time to scaling data workflows without creating more maintenance work, and Enterprise features made the value obvious much faster than I expected. Excellent data platform. Cost management requires attention. Worth the investment for analytics capability. The rollout needed some refinement, but once we got through that, the gains were clear in real work."
  },
  {
    "id": "new-relic-grace-wong",
    "dealId": "new-relic",
    "author": "Grace Wong",
    "role": "Site Reliability Engineer",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Grace%20Wong%2C%20Site%20Reliability%20Engineer",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "By the time we rolled out New Relic, seeing what broke without stitching together three dashboards was already slowing us down, and AI-powered insights gave us a cleaner operating rhythm almost immediately. New Relic's observability platform gives us complete visibility. The 100GB free data is generous. Alerts prevent issues before customers notice. It is one of the few startup perks we kept without much debate because the operational payoff showed up in the first month, not six months later."
  },
  {
    "id": "new-relic-marcus-thompson",
    "dealId": "new-relic",
    "author": "Marcus Thompson",
    "role": "DevOps Lead",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus%20Thompson%2C%20DevOps%20Lead",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "From a devops lead perspective, New Relic started paying for itself once we were serious about catching issues before users reported them, and 100GB free data per month solved the part of the workflow that kept creating follow-up work. Distributed tracing through microservices is invaluable. Dashboard customization is flexible. Performance insights are actionable. We were able to validate it under real volume before budget became the main conversation, and that changed the quality of the decision completely."
  },
  {
    "id": "new-relic-elena-petrov",
    "dealId": "new-relic",
    "author": "Elena Petrov",
    "role": "Backend Engineer",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena%20Petrov%2C%20Backend%20Engineer",
    "rating": 4,
    "date": "2026-04-23",
    "quote": "What pushed us toward New Relic was the need to get better at seeing what broke without stitching together three dashboards, and AI-powered insights handled the exact part of the process that had become messy. Comprehensive monitoring tool. Learning all features takes time. Documentation and support are helpful. It was not perfect on day one, although the underlying value showed up quickly enough that the team stayed with it."
  },
  {
    "id": "cleura-hans-mueller",
    "dealId": "cleura",
    "author": "Hans Mueller",
    "role": "German Founder",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Hans%20Mueller%2C%20German%20Founder",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "The reason Cleura stuck for us is that it helped with keeping infrastructure spend predictable while still shipping quickly without turning setup into another side project, especially around Privacy-focused infrastructure. Cleura's privacy focus aligns with our values. The cloud credits provided good infrastructure support. European hosting matters to us. Once the workflow was in place, the team stopped working around the process and actually started relying on it."
  },
  {
    "id": "cleura-anna-andersen",
    "dealId": "cleura",
    "author": "Anna Andersen",
    "role": "Danish CTO",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Anna%20Andersen%2C%20Danish%20CTO",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "We tested Cleura because we were tired of losing time to running production and staging without adding DevOps overhead too early, and Object storage made the value obvious much faster than I expected. GDPR compliance is built-in. Data sovereignty is respected. Support team understands European requirements. It ended up removing more follow-up and cleanup work than I expected, which is what makes the savings feel tangible."
  },
  {
    "id": "cleura-sofia-silva",
    "dealId": "cleura",
    "author": "Sofia Silva",
    "role": "Portuguese DevOps",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Sofia%20Silva%2C%20Portuguese%20DevOps",
    "rating": 4,
    "date": "2026-04-23",
    "quote": "The reason Cleura stuck for us is that it helped with running production and staging without adding DevOps overhead too early without turning setup into another side project, especially around Approximately $10,000 in value. Good privacy-focused alternative. Feature set is smaller than hyperscalers. Perfect for our needs. Even with some setup overhead, it delivered enough practical value that we kept expanding how we use it."
  },
  {
    "id": "fireworks-ai-dr-aisha-patel",
    "dealId": "fireworks-ai",
    "author": "Dr. Aisha Patel",
    "role": "ML Engineer",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Dr.%20Aisha%20Patel%2C%20ML%20Engineer",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "By the time we rolled out Fireworks AI, shipping production AI use cases without fragile glue code was already slowing us down, and Fast inference speeds gave us a cleaner operating rhythm almost immediately. Fireworks' inference speeds are impressive. The AI credits covered months of experimentation. Cost per inference is excellent. It is one of the few startup perks we kept without much debate because the operational payoff showed up in the first month, not six months later."
  },
  {
    "id": "fireworks-ai-david-kim",
    "dealId": "fireworks-ai",
    "author": "David Kim",
    "role": "AI Product Manager",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=David%20Kim%2C%20AI%20Product%20Manager",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "From a ai product manager perspective, Fireworks AI started paying for itself once we were serious about moving AI features from experiments into something customers could depend on, and Approximately $5,000 in value solved the part of the workflow that kept creating follow-up work. Building AI features is affordable with Fireworks. Model variety is good. API is straightforward. We were able to validate it under real volume before budget became the main conversation, and that changed the quality of the decision completely."
  },
  {
    "id": "fireworks-ai-sophie-chen",
    "dealId": "fireworks-ai",
    "author": "Sophie Chen",
    "role": "AI Engineer",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie%20Chen%2C%20AI%20Engineer",
    "rating": 4,
    "date": "2026-04-23",
    "quote": "We did not add Fireworks AI for vanity metrics; we added it because testing model-backed workflows without letting cost spiral needed a real fix, and Open-source model serving delivered that first. Great AI infrastructure. Documentation could be more comprehensive. Support team is responsive. The learning curve was manageable compared with the time it saves now, which is why it remained part of the stack."
  },
  {
    "id": "infura-dr-james-nakamoto",
    "dealId": "infura",
    "author": "Dr. James Nakamoto",
    "role": "Blockchain Developer",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Dr.%20James%20Nakamoto%2C%20Blockchain%20Developer",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "As blockchain developer, Infura started paying for itself once we were serious about keeping blockchain infrastructure dependable during traffic swings, and Reliable infrastructure solved the part of the workflow that kept creating follow-up work. Infura's Ethereum APIs are reliable. API credits covered our development. Building DeFi apps is straightforward. We were able to validate it under real volume before budget became the main conversation, and that changed the quality of the decision completely."
  },
  {
    "id": "infura-cassandra-wong",
    "dealId": "infura",
    "author": "Cassandra Wong",
    "role": "Smart Contract Dev",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Cassandra%20Wong%2C%20Smart%20Contract%20Dev",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "By the time we rolled out Infura, shipping Web3 features without RPC instability was already slowing us down, and Approximately $3,000 in value gave us a cleaner operating rhythm almost immediately. IPFS storage integration is seamless. NFT APIs work great. Documentation is developer-friendly. It is one of the few startup perks we kept without much debate because the operational payoff showed up in the first month, not six months later."
  },
  {
    "id": "infura-marcus-stone",
    "dealId": "infura",
    "author": "Marcus Stone",
    "role": "Web3 CTO",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus%20Stone%2C%20Web3%20CTO",
    "rating": 4,
    "date": "2026-04-23",
    "quote": "What pushed us toward Infura was the need to get better at shipping Web3 features without RPC instability, and IPFS storage handled the exact part of the process that had become messy. Good blockchain infrastructure. Some advanced features have learning curve. Support is helpful. It was not perfect on day one, although the underlying value showed up quickly enough that the team stayed with it."
  },
  {
    "id": "inworld-ai-professor-elena-vasquez",
    "dealId": "inworld-ai",
    "author": "Professor Elena Vasquez",
    "role": "Game Designer",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Professor%20Elena%20Vasquez%2C%20Game%20Designer",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "What pushed us toward Inworld AI was the need to get better at testing model-backed workflows without letting cost spiral, and API handled the exact part of the process that had become messy. Inworld AI created amazing character interactions. The AI credits covered development costs. Interactive experiences feel alive. The biggest win was how quickly the team trusted it once it was live, which is why platform access felt like real leverage and not just a headline discount."
  },
  {
    "id": "inworld-ai-yuki-tanaka",
    "dealId": "inworld-ai",
    "author": "Yuki Tanaka",
    "role": "Game Developer",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Yuki%20Tanaka%2C%20Game%20Developer",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "From a game developer perspective, Inworld AI started paying for itself once we were serious about moving AI features from experiments into something customers could depend on, and Conversational AI solved the part of the workflow that kept creating follow-up work. Building NPCs with personality is now straightforward. Memory systems add depth. API is developer-friendly. We were able to validate it under real volume before budget became the main conversation, and that changed the quality of the decision completely."
  },
  {
    "id": "inworld-ai-marcus-johnson",
    "dealId": "inworld-ai",
    "author": "Marcus Johnson",
    "role": "AI Developer",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus%20Johnson%2C%20AI%20Developer",
    "rating": 4,
    "date": "2026-04-23",
    "quote": "What pushed us toward Inworld AI was the need to get better at moving AI features from experiments into something customers could depend on, and Character creation tools handled the exact part of the process that had become messy. Great conversational AI tool. Learning all features takes time. Community is supportive. It was not perfect on day one, although the underlying value showed up quickly enough that the team stayed with it."
  },
  {
    "id": "oracle-dr-robert-hayes",
    "dealId": "oracle",
    "author": "Dr. Robert Hayes",
    "role": "Enterprise Architect",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Dr.%20Robert%20Hayes%2C%20Enterprise%20Architect",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "We tested Oracle because we were tired of losing time to keeping infrastructure spend predictable while still shipping quickly, and Compute services made the value obvious much faster than I expected. Oracle's startup credits enabled enterprise-grade infrastructure. Cloud services are reliable. Support is professional. It ended up removing more follow-up and cleanup work than I expected, which is what makes the savings feel tangible."
  },
  {
    "id": "oracle-jennifer-lopez",
    "dealId": "oracle",
    "author": "Jennifer Lopez",
    "role": "CTO",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Jennifer%20Lopez%2C%20CTO",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "We did not add Oracle for vanity metrics; we added it because keeping infrastructure spend predictable while still shipping quickly needed a real fix, and Approximately $100,000 in value delivered that first. Building on Oracle infrastructure instilled confidence in enterprise customers. Database services are powerful. Startup program support exceeded expectations. That mix of measurable ROI and low friction is why we kept it in the stack after the offer period instead of treating it like a temporary experiment."
  },
  {
    "id": "oracle-vikram-singh",
    "dealId": "oracle",
    "author": "Vikram Singh",
    "role": "Backend Lead",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram%20Singh%2C%20Backend%20Lead",
    "rating": 4,
    "date": "2026-04-23",
    "quote": "From a backend lead perspective, Oracle started paying for itself once we were serious about keeping infrastructure spend predictable while still shipping quickly, and Cloud storage solved the part of the workflow that kept creating follow-up work. Enterprise-grade infrastructure. Some services require learning. Oracle's documentation and support help. It took a bit of iteration to get the workflow dialed in, but the result was strong enough that nobody wanted to go back."
  },
  {
    "id": "siemens-dr-hans-mueller",
    "dealId": "siemens",
    "author": "Dr. Hans Mueller",
    "role": "Industrial Engineer",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Dr.%20Hans%20Mueller%2C%20Industrial%20Engineer",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "What pushed us toward Siemens was the need to get better at removing repetitive engineering work from weekly operations, and Industry connections handled the exact part of the process that had become messy. Siemens tools are industry-leading. Access to expertise and partnerships accelerated our development. Industrial connections are invaluable. The biggest win was how quickly the team trusted it once it was live, which is why startup program felt like real leverage and not just a headline discount."
  },
  {
    "id": "siemens-anna-chen",
    "dealId": "siemens",
    "author": "Anna Chen",
    "role": "CTO",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Anna%20Chen%2C%20CTO",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "In my role as cto, Siemens started paying for itself once we were serious about speeding up workflows that had been blocked by manual setup, and Approximately $20,000 in value solved the part of the workflow that kept creating follow-up work. Digital twin technology from Siemens transformed our simulations. Mentorship from Siemens was outstanding. Tools are enterprise-grade. We were able to validate it under real volume before budget became the main conversation, and that changed the quality of the decision completely."
  },
  {
    "id": "siemens-marco-santini",
    "dealId": "siemens",
    "author": "Marco Santini",
    "role": "Product Manager",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Marco%20Santini%2C%20Product%20Manager",
    "rating": 4,
    "date": "2026-04-23",
    "quote": "We tested Siemens because we were tired of losing time to giving the team leverage without building more internal overhead, and Automation tools made the value obvious much faster than I expected. Excellent industrial partnership. Learning Siemens tools takes time. Worth investment for manufacturing startups. The rollout needed some refinement, but once we got through that, the gains were clear in real work."
  },
  {
    "id": "together-ai-dr-priya-sharma",
    "dealId": "together-ai",
    "author": "Dr. Priya Sharma",
    "role": "ML Research Lead",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Dr.%20Priya%20Sharma%2C%20ML%20Research%20Lead",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "We did not add Together AI for vanity metrics; we added it because moving AI features from experiments into something customers could depend on needed a real fix, and Approximately $10,000 in value delivered that first. Together AI's GPU resources enabled serious model training. The $10K credits covered months of experimentation. Infrastructure is reliable. That mix of measurable ROI and low friction is why we kept it in the stack after the offer period instead of treating it like a temporary experiment."
  },
  {
    "id": "together-ai-kai-chen",
    "dealId": "together-ai",
    "author": "Kai Chen",
    "role": "ML Engineer",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Kai%20Chen%2C%20ML%20Engineer",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "From a ml engineer perspective, Together AI started paying for itself once we were serious about moving AI features from experiments into something customers could depend on, and Batch processing solved the part of the workflow that kept creating follow-up work. Training language models became affordable. Inference speeds are excellent. Support team understands ML needs. We were able to validate it under real volume before budget became the main conversation, and that changed the quality of the decision completely."
  },
  {
    "id": "together-ai-elena-rodriguez",
    "dealId": "together-ai",
    "author": "Elena Rodriguez",
    "role": "AI Product Manager",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena%20Rodriguez%2C%20AI%20Product%20Manager",
    "rating": 4,
    "date": "2026-04-23",
    "quote": "By the time we rolled out Together AI, shipping production AI use cases without fragile glue code was already slowing us down, and Inference API gave us a cleaner operating rhythm almost immediately. Great GPU infrastructure. Learning optimization takes time. Documentation is helpful. We had to refine the setup a bit, but the improvement in execution was real and easy to defend internally."
  },
  {
    "id": "wiz-dr-sarah-williams",
    "dealId": "wiz",
    "author": "Dr. Sarah Williams",
    "role": "CISO",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Dr.%20Sarah%20Williams%2C%20CISO",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "Our team adopted Wiz at the point where making security reviews less painful for a small team was already affecting execution, and Compliance checking changed the workflow more than the vendor pitch did. Wiz provided comprehensive cloud security visibility. Vulnerability scanning caught critical issues. The startup tools access was valuable. What made it easy to keep after the trial was that startup program gave us enough room to test it on a live workflow instead of judging it from a polished demo."
  },
  {
    "id": "wiz-michael-park",
    "dealId": "wiz",
    "author": "Michael Park",
    "role": "Security Engineer",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael%20Park%2C%20Security%20Engineer",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "Our team adopted Wiz at the point where tightening risk posture before bigger customer audits was already affecting execution, and Approximately $5,000 in value changed the workflow more than the vendor pitch did. Misconfiguration detection improved our security posture significantly. Compliance checking is thorough. Dashboard is intuitive. What made it easy to keep after the trial was that startup program gave us enough room to test it on a live workflow instead of judging it from a polished demo."
  },
  {
    "id": "wiz-jessica-chen",
    "dealId": "wiz",
    "author": "Jessica Chen",
    "role": "Infrastructure Lead",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica%20Chen%2C%20Infrastructure%20Lead",
    "rating": 4,
    "date": "2026-04-23",
    "quote": "The reason Wiz stuck for us is that it helped with tightening risk posture before bigger customer audits without turning setup into another side project, especially around Threat detection. Great cloud security tool. Learning all features takes time. Support is responsive. Even with some setup overhead, it delivered enough practical value that we kept expanding how we use it."
  },
  {
    "id": "0x-dr-satoshi-kim",
    "dealId": "0x",
    "author": "Dr. Satoshi Kim",
    "role": "DeFi Developer",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Dr.%20Satoshi%20Kim%2C%20DeFi%20Developer",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "We tested 0x Protocol because we were tired of losing time to keeping blockchain infrastructure dependable during traffic swings, and DEX infrastructure made the value obvious much faster than I expected. 0x Protocol is incredibly powerful for building DeFi. The $5K credits covered our development. Infrastructure is reliable. It ended up removing more follow-up and cleanup work than I expected, which is what makes the savings feel tangible."
  },
  {
    "id": "0x-victoria-lee",
    "dealId": "0x",
    "author": "Victoria Lee",
    "role": "Product Manager",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Victoria%20Lee%2C%20Product%20Manager",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "We did not add 0x Protocol for vanity metrics; we added it because reducing operational drag around on-chain product work needed a real fix, and Documentation delivered that first. Building DEX features with 0x is straightforward. Liquidity access is comprehensive. Support team understands DeFi. That mix of measurable ROI and low friction is why we kept it in the stack after the offer period instead of treating it like a temporary experiment."
  },
  {
    "id": "0x-marcus-wang",
    "dealId": "0x",
    "author": "Marcus Wang",
    "role": "Backend Engineer",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus%20Wang%2C%20Backend%20Engineer",
    "rating": 4,
    "date": "2026-04-23",
    "quote": "The reason 0x Protocol stuck for us is that it helped with keeping blockchain infrastructure dependable during traffic swings without turning setup into another side project, especially around DeFi tools. Good DeFi infrastructure. Learning curve for complex operations. Documentation helps. Even with some setup overhead, it delivered enough practical value that we kept expanding how we use it."
  },
  {
    "id": "browserbase-dr-alex-petrov",
    "dealId": "browserbase",
    "author": "Dr. Alex Petrov",
    "role": "Automation Engineer",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Dr.%20Alex%20Petrov%2C%20Automation%20Engineer",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "Our team adopted Browserbase at the point where replacing brittle manual workflows with something the team could actually own was already affecting execution, and Web scraping tools changed the workflow more than the vendor pitch did. Browserbase handled complex browser automation. The automation credits covered months of usage. Infrastructure is reliable. What made it easy to keep after the trial was that startup program gave us enough room to test it on a live workflow instead of judging it from a polished demo."
  },
  {
    "id": "browserbase-lily-wong",
    "dealId": "browserbase",
    "author": "Lily Wong",
    "role": "Web Scraping Lead",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Lily%20Wong%2C%20Web%20Scraping%20Lead",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "We did not add Browserbase for vanity metrics; we added it because turning operational cleanup into a process instead of a weekly scramble needed a real fix, and Developer API delivered that first. Web scraping at scale is now manageable. JavaScript execution works perfectly. Documentation is clear. That mix of measurable ROI and low friction is why we kept it in the stack after the offer period instead of treating it like a temporary experiment."
  },
  {
    "id": "browserbase-james-anderson",
    "dealId": "browserbase",
    "author": "James Anderson",
    "role": "QA Automation",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=James%20Anderson%2C%20QA%20Automation",
    "rating": 4,
    "date": "2026-04-23",
    "quote": "We brought Browserbase in when automating repetitive work without introducing another maintenance burden was becoming a weekly problem, and Web scraping tools was the first part of the rollout that made the team stop second-guessing the switch. Good automation infrastructure. Learning API takes time. Support is responsive. There are still edges to smooth out, yet the benefit is obvious enough in weekly operations that it earned its place."
  },
  {
    "id": "mercury-victoria-lopez",
    "dealId": "mercury",
    "author": "Victoria Lopez",
    "role": "CFO",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Victoria%20Lopez%2C%20CFO",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "We brought Mercury in when making spend control and month-end cleaner was becoming a weekly problem, and Spending controls was the first part of the rollout that made the team stop second-guessing the switch. Mercury's perks ecosystem provided immediate value. Business banking is straightforward. Startup community is supportive. The tool stuck because it improved day-to-day execution, not because it looked good in onboarding or vendor calls."
  },
  {
    "id": "mercury-david-thompson",
    "dealId": "mercury",
    "author": "David Thompson",
    "role": "Founder",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=David%20Thompson%2C%20Founder",
    "rating": 5,
    "date": "2026-04-23",
    "quote": "Our team adopted Mercury at the point where making spend control and month-end cleaner was already affecting execution, and Exclusive deals changed the workflow more than the vendor pitch did. Banking for startups is now simple. Perks marketplace saves money. Accounting integration is seamless. What made it easy to keep after the trial was that banking + perks gave us enough room to test it on a live workflow instead of judging it from a polished demo."
  },
  {
    "id": "mercury-sophie-chen",
    "dealId": "mercury",
    "author": "Sophie Chen",
    "role": "Finance Manager",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie%20Chen%2C%20Finance%20Manager",
    "rating": 4,
    "date": "2026-04-23",
    "quote": "What pushed us toward Mercury was the need to get better at reducing approval and reconciliation work that used to sit in spreadsheets, and Financial management handled the exact part of the process that had become messy. Good startup banking solution. Learning all perks takes time. Support team is helpful. It was not perfect on day one, although the underlying value showed up quickly enough that the team stayed with it."
  }
];

export function getFallbackReviewsForDeal(dealId: string) {
  return dealReviews.filter((review) => review.dealId === dealId).slice(0, 5);
}

export function getDealReview(dealId: string) {
  return getFallbackReviewsForDeal(dealId)[0] || null;
}
