import re
import os

css_files = [
    "src/app/components/About/About.module.css",
    "src/app/components/Blog/Blog.module.css",
    "src/app/components/Blog/BlogList.module.css",
    "src/app/components/Contact/Contact.module.css",
    "src/app/components/Docs/Docs.module.css",
    "src/app/components/FundManagers/FundManagers.module.css",
    "src/app/components/HomeProducts/HomeProducts.module.css",
    "src/app/components/Performance/Performance.module.css",
    "src/app/components/Products/Products.module.css",
    "src/app/components/SocialMedia/SocialMedia.module.css",
    "src/app/components/Stats/Stats.module.css",
    "src/app/components/Webinar/Webinar.module.css"
]

# Updated regex pattern to match leading 0s for decimal values:
# Matches: 1.2s cubic-bezier(0.16, 1, 0.3, 1) and 1.4s cubic-bezier(.16, 1, .3, 1) etc.
regex_pattern = r'(\b\d+(?:\.\d+)?s)\s+cubic-bezier\(\s*(?:0\.)?16\s*,\s*1\s*,\s*(?:0\.)?3\s*,\s*1\s*\)'

for filepath in css_files:
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        modified, count = re.subn(regex_pattern, r'1.8s cubic-bezier(0.2, 1, 0.3, 1)', content)
        if count > 0:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(modified)
            print(f"Updated {filepath}: {count} replacements.")
        else:
            print(f"No match in {filepath}")
    else:
        print(f"File not found: {filepath}")
