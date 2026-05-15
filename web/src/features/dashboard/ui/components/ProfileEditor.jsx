import {
  BriefcaseBusiness,
  GraduationCap,
  Link2,
  Plus,
  Save,
  Trash2,
  UserRound,
} from "lucide-react";

import { Button } from "../../../../shared/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../shared/components/ui/card";
import { Input } from "../../../../shared/components/ui/input";
import useArrayInput from "./useArrayInput";

function Field({ children, label }) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-semibold text-(--color-muted)">{label}</span>
      {children}
    </label>
  );
}

function Textarea({ value, onChange, placeholder, rows = 5 }) {
  return (
    <textarea
      className="min-h-28 w-full resize-y rounded-lg border border-(--color-border) bg-(--color-surface) px-3 py-3 text-sm text-(--color-text) shadow-sm outline-none transition placeholder:text-(--color-muted) focus:border-(--color-accent) focus:bg-(--color-surface-strong) focus:ring-2 focus:ring-[var(--ring-soft)]"
      placeholder={placeholder}
      rows={rows}
      value={value}
      onChange={onChange}
    />
  );
}

function SectionTitle({ icon: Icon, title, description }) {
  return (
    <div className="flex items-start gap-3">
      <span className="grid h-10 w-10 place-items-center rounded-xl border border-(--color-border) bg-(--color-bg) text-(--color-accent)">
        <Icon size={18} aria-hidden="true" />
      </span>
      <div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </div>
    </div>
  );
}

function ArrayInput({ label, value, onChange, placeholder }) {
  const { addDraftItems, draft, handleKeyDown, removeItem, setDraft } =
    useArrayInput({ onChange, value });

  return (
    <Field label={label}>
      <div className="rounded-lg border border-(--color-border) bg-(--color-surface) p-2 shadow-sm transition focus-within:border-(--color-accent) focus-within:bg-(--color-surface-strong) focus-within:ring-2 focus-within:ring-[var(--ring-soft)]">
        {value.length ? (
          <div className="mb-2 flex flex-wrap gap-2">
            {value.map((item) => (
              <button
                className="app-chip rounded-full px-3 py-1 text-xs font-semibold text-(--color-text) transition hover:border-(--color-accent)"
                key={item}
                type="button"
                onClick={() => removeItem(item)}
              >
                {item}
                <span className="ml-2 text-(--color-muted)">x</span>
              </button>
            ))}
          </div>
        ) : null}

        <input
          className="h-8 w-full bg-transparent px-1 text-sm text-(--color-text) outline-none placeholder:text-(--color-muted)"
          placeholder={placeholder}
          value={draft}
          onBlur={() => addDraftItems()}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
      <p className="text-xs text-(--color-dim)">
        Press comma or Enter to add. Click a chip to remove.
      </p>
    </Field>
  );
}

function ExperienceFields({ experiences, onChange }) {
  function updateExperience(index, key, value) {
    onChange(
      experiences.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [key]: value } : item
      )
    );
  }

  function removeExperience(index) {
    onChange(experiences.filter((_, itemIndex) => itemIndex !== index));
  }

  return (
    <div className="grid gap-3">
      {experiences.map((experience, index) => (
        <div
          className="grid gap-3 rounded-xl border border-(--color-border) bg-(--color-bg) p-4 md:grid-cols-[1fr_1fr_auto]"
          key={index}
        >
          <Field label="Company / Role">
            <Input
              placeholder="Frontend Developer at Acme"
              value={experience.companyName}
              onChange={(event) => updateExperience(index, "companyName", event.target.value)}
            />
          </Field>
          <Field label="Time period">
            <Input
              placeholder="Jan 2024 - Present"
              value={experience.timePeriod}
              onChange={(event) => updateExperience(index, "timePeriod", event.target.value)}
            />
          </Field>
          <button
            className="self-end rounded-lg border border-(--color-border) p-2 text-(--color-muted) transition hover:border-(--color-border-strong) hover:text-(--color-text)"
            type="button"
            onClick={() => removeExperience(index)}
          >
            <Trash2 size={16} aria-hidden="true" />
            <span className="sr-only">Remove experience</span>
          </button>
        </div>
      ))}
      <Button
        className="w-fit"
        type="button"
        variant="outline"
        onClick={() => onChange([...experiences, { companyName: "", timePeriod: "" }])}
      >
        <Plus size={16} aria-hidden="true" />
        Add experience
      </Button>
    </div>
  );
}

function EducationFields({ educations, onChange }) {
  function updateEducation(index, key, value) {
    onChange(
      educations.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [key]: value } : item
      )
    );
  }

  function removeEducation(index) {
    onChange(educations.filter((_, itemIndex) => itemIndex !== index));
  }

  return (
    <div className="grid gap-3">
      {educations.map((education, index) => (
        <div
          className="grid gap-3 rounded-xl border border-(--color-border) bg-(--color-bg) p-4 md:grid-cols-[1fr_1fr_1fr_auto]"
          key={index}
        >
          <Field label="College">
            <Input
              placeholder="College name"
              value={education.collegeName}
              onChange={(event) => updateEducation(index, "collegeName", event.target.value)}
            />
          </Field>
          <Field label="Course">
            <Input
              placeholder="B.Tech CSE"
              value={education.course}
              onChange={(event) => updateEducation(index, "course", event.target.value)}
            />
          </Field>
          <Field label="Time period">
            <Input
              placeholder="2022 - 2026"
              value={education.timePeriod}
              onChange={(event) => updateEducation(index, "timePeriod", event.target.value)}
            />
          </Field>
          <button
            className="self-end rounded-lg border border-(--color-border) p-2 text-(--color-muted) transition hover:border-(--color-border-strong) hover:text-(--color-text)"
            type="button"
            onClick={() => removeEducation(index)}
          >
            <Trash2 size={16} aria-hidden="true" />
            <span className="sr-only">Remove education</span>
          </button>
        </div>
      ))}
      <Button
        className="w-fit"
        type="button"
        variant="outline"
        onClick={() =>
          onChange([...educations, { collegeName: "", course: "", timePeriod: "" }])
        }
      >
        <Plus size={16} aria-hidden="true" />
        Add education
      </Button>
    </div>
  );
}

function ProfileEditor({
  form,
  isSavingGeneral = false,
  isSavingProfessional = false,
  isSavingSocial = false,
  onFieldChange,
  onProfessionalChange,
  onSocialChange,
  onSaveGeneral,
  onSaveProfessional,
  onSaveSocial,
}) {
  const socialFields = ["github", "linkedin", "x", "youtube", "portfolio", "instagram"];

  return (
    <div className="grid gap-5">
      <Card className="app-card">
        <CardHeader>
          <SectionTitle
            icon={UserRound}
            title="General Profile"
            description="Update your name, headline, and public about section."
          />
        </CardHeader>
        <CardContent>
          <form className="grid gap-4" onSubmit={onSaveGeneral}>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="User name">
                <Input
                  placeholder="Your display name"
                  value={form.userName}
                  onChange={(event) => onFieldChange("userName", event.target.value)}
                />
              </Field>
              <Field label="Email">
                <Input disabled value={form.email} />
              </Field>
            </div>

            <Field label="Headline">
              <Input
                placeholder="Full stack developer, React specialist..."
                value={form.headline}
                onChange={(event) => onFieldChange("headline", event.target.value)}
              />
            </Field>

            <Field label="About">
              <Textarea
                placeholder="Tell people what you build, what you are learning, and what kind of work you like."
                value={form.about}
                onChange={(event) => onFieldChange("about", event.target.value)}
              />
            </Field>

            <Button className="w-fit" disabled={isSavingGeneral} type="submit">
              <Save size={16} aria-hidden="true" />
              {isSavingGeneral ? "Saving..." : "Save general info"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="app-card">
        <CardHeader>
          <SectionTitle
            icon={BriefcaseBusiness}
            title="Professional Info"
            description="Shape the skill, education, and experience sections of your portfolio."
          />
        </CardHeader>
        <CardContent>
          <form className="grid gap-5" onSubmit={onSaveProfessional}>
            <div className="grid gap-4 md:grid-cols-3">
              <ArrayInput
                label="Skills / Tech stack"
                placeholder="React, Node.js, MongoDB"
                value={form.skills}
                onChange={(value) => onProfessionalChange("skills", value)}
              />
              <ArrayInput
                label="Interests"
                placeholder="Open source, AI, SaaS"
                value={form.interests}
                onChange={(value) => onProfessionalChange("interests", value)}
              />
              <ArrayInput
                label="Languages"
                placeholder="English, Hindi"
                value={form.languages}
                onChange={(value) => onProfessionalChange("languages", value)}
              />
            </div>

            <div className="grid gap-3">
              <div className="flex items-center gap-2 text-sm font-bold">
                <BriefcaseBusiness size={16} aria-hidden="true" />
                Experiences
              </div>
              <ExperienceFields
                experiences={form.experiences}
                onChange={(value) => onProfessionalChange("experiences", value)}
              />
            </div>

            <div className="grid gap-3">
              <div className="flex items-center gap-2 text-sm font-bold">
                <GraduationCap size={16} aria-hidden="true" />
                Educations
              </div>
              <EducationFields
                educations={form.educations}
                onChange={(value) => onProfessionalChange("educations", value)}
              />
            </div>

            <Button className="w-fit" disabled={isSavingProfessional} type="submit">
              <Save size={16} aria-hidden="true" />
              {isSavingProfessional ? "Saving..." : "Save professional info"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="app-card">
        <CardHeader>
          <SectionTitle
            icon={Link2}
            title="Social Links"
            description="Add places where people can inspect your work and connect."
          />
        </CardHeader>
        <CardContent>
          <form className="grid gap-4" onSubmit={onSaveSocial}>
            <div className="grid gap-4 md:grid-cols-2">
              {socialFields.map((field) => (
                <Field label={field} key={field}>
                  <Input
                    placeholder={`https://${field}.com/your-handle`}
                    value={form.socialLinks[field]}
                    onChange={(event) => onSocialChange(field, event.target.value)}
                  />
                </Field>
              ))}
            </div>

            <Button className="w-fit" disabled={isSavingSocial} type="submit">
              <Save size={16} aria-hidden="true" />
              {isSavingSocial ? "Saving..." : "Save social links"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default ProfileEditor;
