# Lesson: Skill Repository Archetypes

**Date**: 2026-03-03
**Source**: rrr: mahirocoko

## Pattern

Skill repositories fall into three distinct archetypes with different purposes and quality models:

### 1. Build Tools (agent-skills)
- **Purpose**: Compile markdown rules into consumable format
- **Quality Model**: Schema validation + CI
- **Has**: Parser, validator, build pipeline
- **No**: Runtime execution

### 2. Production Capabilities (anthropics/skills)
- **Purpose**: Actual capabilities that power AI features
- **Quality Model**: Real tool integration testing
- **Has**: Scripts, external dependencies (LibreOffice, pandoc)
- **No**: Build step (docs consumed directly)

### 3. Knowledge Bases (next-skills)
- **Purpose**: Domain expertise for AI guidance
- **Quality Model**: Manual review + accuracy audit
- **Has**: SKILL.md + topic docs
- **No**: Code or scripts

## Key Insight

Each archetype optimizes for different things:
- Build tools → Consistency and automation
- Production → Reliability and real-world execution
- Knowledge bases → Accuracy and comprehensiveness

When creating or evaluating skills, identify the archetype first to set appropriate quality expectations.

## Application

Our frontend skill is a **knowledge base** with some **production capability** elements (scripts/runner). The upgrade to Agent Skills spec makes it more portable, but the real value is in the opinionated content (Component Scale Contract, token-first enforcement) which is more specific than typical knowledge bases.

## Tags

`skills`, `patterns`, `agent-skills`, `documentation`, `architecture`
