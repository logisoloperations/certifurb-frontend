import re

# Read the file
with open('cert.sql', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace escaped single quotes with doubled single quotes
# In PostgreSQL, single quotes inside string literals are escaped by doubling them: '' not \'
# We need to be careful - we only want to replace \' that are inside string literals
# But since we're dealing with SQL INSERT statements, we can safely replace all \' with ''
content = re.sub(r"\\'", "''", content)

# Write back
with open('cert.sql', 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed escaped single quotes in string literals!")
