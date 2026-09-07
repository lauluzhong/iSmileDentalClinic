// Plain data only — no JSX. The build-time prerenderer (vite-plugin-blog-ssg.js)
// imports this file in Node, and the /services pages render everything from it.
// services[].name/desc/path, displayTitle, hero, description and tier1 strings
// are load-bearing (prerenderer + booking labels); title keeps its literal \n
// because Services.jsx derives the booking label from title.split("\n")[0].
export const servicesData = {
    protect: {
        title: "Protect & Repair\n (Preventive & Restorative)",
        displayTitle: "Protect & Repair",
        bracketText: "Preventive & Restorative",
        hero: "Healthy Teeth. For Life.",
        description: "Competent and committed services to help you maintain a healthy smile.",
        services: [
            { name: "Comprehensive Examination and Diagnosis", desc: "Detailed evaluation to cover your oral health for accurate diagnosis and treatment planning." },
            { name: "Scaling & Polishing", desc: "Professional cleaning to remove plaque, tartar, and surface stains." },
            { name: "Tooth Fillings", desc: "Restoring decayed teeth with high-quality tooth-coloured materials." },
            { name: "Root Canal Treatment", desc: "Saving infected teeth by removing damaged pulp and sealing the root.", path: "/services/protect/root-canal" },
            { name: "Wisdom Tooth Surgery", desc: "Safe removal of impacted wisdom teeth to prevent pain and crowding.", path: "/services/protect/wisdom-tooth" }
        ],
        tier1: {
            title: "Root Canal Treatment",
            desc: "Save your natural tooth. Advanced endodontic therapy to relieve pain and restore function.",
            path: "/services/protect/root-canal"
        },
        experience: {
            title: "Preventive Dentistry & Long-Term Care",
            desc: "Our philosophy is simple: prevention is better than cure. We prioritize early detection to preserve your natural tooth structure, using minimally invasive techniques that save you time, money, and discomfort in the long run.",
            benefits: [
                "Digital Diagnostic Imaging for Early Detection",
                "Minimally Invasive Restorative Techniques",
                "Comprehensive Gum Health Management",
                "Anxiety-Free, Judgment-Free Environment"
            ]
        }
    },
    straighten: {
        title: "Straighten Teeth\n (Orthodontics)",
        displayTitle: "Straighten Teeth",
        bracketText: "Orthodontics",
        hero: "Confidence in Every Smile.",
        description: "Modern orthodontic solutions for children, teens, and adults.",
        services: [
            { name: "Clear Aligners", desc: "Invisible, removable trays (Invisalign / Angel / ClearSmile) for discreet straightening.", path: "/services/straighten/clear-aligners" },
            { name: "Fixed Appliances (Metal & Clear Brackets)", desc: "Powered by the latest Damon Ultima, Q2, and Clear 2 technology." },
            { name: "Removable Appliances", desc: "Early intervention devices for minor tooth movements and growth." },
            { name: "Retainers", desc: "Custom devices (Hawley/Essix) to maintain your new smile after treatment." }
        ],
        tier1: {
            title: "Clear Aligners (Invisalign / Angel / ClearSmile)",
            desc: "The clear alternative to braces. Straighten your teeth without anyone knowing.",
            path: "/services/straighten/clear-aligners"
        },
        experience: {
            title: "Digital 3D Scanning",
            desc: "No more messy moulds. We use advanced 3D scanners to visualize your new smile instantly.",
            visualTitle: "Fixed Braces vs. Clear Aligners",
            // Formerly a JSX <ul>; the visible strings are identical
            // (label renders bold, followed by ": " and the text).
            comparison: [
                { label: "Visibility", text: "Clear Aligners are virtually invisible, whereas braces are noticeable." },
                { label: "Comfort", text: "Aligners are smooth plastic (no wires/brackets), reducing irritation." },
                { label: "Hygiene", text: "Aligners are removable, making flossing and brushing easier." },
                { label: "Diet", text: "No dietary restrictions with aligners; just remove them to eat!" }
            ]
        }
    },
    replace: {
        title: "Replace Teeth\n (Prosthetics & Implants)",
        displayTitle: "Replace Teeth",
        bracketText: "Prosthetics & Implants",
        hero: "Eat, Speak, and Smile Again.",
        description: "Restoring function and aesthetics for a complete, confident smile.",
        services: [
            { name: "Dental Implants", desc: "Permanent, natural-looking replacements for missing tooth roots.", path: "/services/replace/dental-implants" },
            { name: "Dental Bridges", desc: "Fixed restoration to bridge the gap created by one or more missing teeth." },
            { name: "Complete Dentures", desc: "Full replacements for missing teeth, restoring function and appearance." },
            { name: "Partial Dentures", desc: "Removable option to replace several missing teeth in a row." },
            { name: "Denture Repairs & Relines", desc: "Maintenance to ensure your dentures fit comfortably and last longer." }
        ],
        tier1: {
            title: "Dental Implants",
            desc: "The gold standard for tooth replacement. Look and function just like natural teeth.",
            path: "/services/replace/dental-implants"
        },
        experience: {
            title: "Function, Comfort, & Confidence",
            desc: "Missing teeth affect more than just your smile—they impact your ability to eat, speak, and live fully. We specialize in functional restoration using biocompatible materials that look and feel like your natural teeth.",
            benefits: [
                "Biocompatible Dental Implants (Titanium)",
                "Bone Preservation to Maintain Facial Structure",
                "High-Esthetic Ceramics for Natural Looks",
                "Full Bite Force Restoration"
            ]
        }
    },
    enhance: {
        title: "Enhance Smile\n (Cosmetic Dentistry)",
        displayTitle: "Enhance Smile",
        bracketText: "Cosmetic Dentistry",
        hero: "Design Your Dream Smile.",
        description: "Cosmetic dental treatments tailored to your unique facial features.",
        services: [
            { name: "Composite Veneers", desc: "Direct bonding to reshape teeth and improve aesthetics in one visit." },
            { name: "Ceramic Veneers", desc: "Durable, high-quality porcelain shells for a flawless, lasting smile." },
            { name: "Take-Home Whitening (Gold Standard)", desc: "Customized trays and professional gels for the most stable, long-lasting results.", path: "/services/enhance/teeth-whitening" },
            { name: "In-House Whitening", desc: "Rapid clinical whitening for immediate results when time is of the essence." },
            { name: "All-Ceramic Crowns", desc: "Strength and beauty combined for badly damaged or aesthetic teeth. Option for single-visit crown by appointment." },
            { name: "Full Mouth Rehabilitation", desc: "Comprehensive restoration of worn down teeth to improve function, health, and appearance." }
        ],
        tier1: {
            title: "Professional Take-Home Whitening",
            desc: "Transform your smile with professional whitening treatments tailored to you.",
            path: "/services/enhance/teeth-whitening"
        },
        experience: {
            title: "Designed for Your Unique Face",
            desc: "True cosmetic dentistry goes beyond just 'white teeth'. We analyze and design a smile with function in mind that is pleasing and harmonious.",
            benefits: [
                "Detailed Smile Analysis",
                "Custom 'Trial Smile' Mock-ups",
                "Minimally Invasive Veneer Protocols",
                "Natural Light Reflection & Texture"
            ]
        }
    },
    children: {
        title: "Children & Growth\n (Paediatric Dentistry)",
        displayTitle: "Children & Growth",
        bracketText: "Paediatric Dentistry",
        hero: "Growing Healthy Smiles & Airways.",
        description: "Intentional care from young children to adolescence, focusing on growth and development.",
        services: [
            { name: "Myofunctional Orthodontics", desc: "Correcting oral habits to guide proper jaw and face growth.", path: "/services/children/myofunctional" },
            { name: "Fissure Sealants", desc: "Protective coatings on back teeth to prevent decay in grooves." },
            { name: "Topical Fluoride", desc: "Strengthening enamel to make teeth more resistant to cavities." },
            { name: "Paediatric Fillings", desc: "Gentle restoration for baby teeth to maintain space and health." },
            { name: "Baby Tooth Extraction", desc: "Careful removal of retained baby teeth to allow adult teeth to erupt." }
        ],
        tier1: {
            title: "Myofunctional Orthodontics",
            desc: "Addressing mouth breathing and oral habits for better sleep and healthy facial development.",
            path: "/services/children/myofunctional"
        },
        experience: {
            title: "Growing Healthy Airways & Smiles",
            desc: "Modern paediatric dentistry is about more than cavities. We rigorously screen for developmental issues like mouth breathing and its causes, incorrect swallowing, low tongue posture, tethered oral tissues, bite interference and retained primitive reflexes, intervening early to ensure your child develops a healthy airway and a broad, beautiful smile.",
            benefits: [
                "Airway-Centric Growth Assessment",
                "Myofunctional Therapy for Oral Habits",
                "Trauma-Free, Child-Friendly Approach",
                "Early Orthodontic Intervention"
            ]
        }
    }
};
