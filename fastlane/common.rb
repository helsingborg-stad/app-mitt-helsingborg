# frozen_string_literal: true

def git_head_identifier
  branch_name = git_branch
  commit = last_git_commit
  ci_matched_env = ENV['CI_MATCHED_ENV'] || '(unknown env)'
  "#{ci_matched_env} #{branch_name} #{commit[:abbreviated_commit_hash]}"
end

def semver_regex
  # official semver regex from https://semver.org/, modified to
  # optionally accept a branch name with forward slash before the semver
  %r{
    ^(?:.+?/)?v?(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]
    \d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)
    (?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?
    (?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$
  }x
end

def extract_version_number_from_name(ref_name, with_meta: false)
  if (m = ref_name.match(semver_regex))
    version_string = with_meta ? (ref_name.split('/')[1] || ref_name) : m.captures[0, 3].join('.')
    puts "extracted semantic version number from branch/ref name \"#{ref_name}\" = #{m.captures.join(' ')}"
    puts "formatted = #{version_string}"
    return version_string
  end
  nil
end

def get_semver_from_branch(head_ref, with_meta: false)
  branch = git_branch
  version_string = extract_version_number_from_name(branch, with_meta: with_meta)
  return version_string if !version_string.nil? && !version_string.empty?

  if !head_ref.nil? && !head_ref.empty?
    version_string = extract_version_number_from_name(head_ref, with_meta: with_meta)
    return version_string if !version_string.nil? && !version_string.empty?
  end

  nil
end

def changelog
  "HEAD: #{git_head_identifier}"
end

desc 'Print the changelog'
lane :print_changelog do
  puts "changelog:\n#{changelog}"
end

desc 'Tag the current ref with the version based on branch name or env input'
lane :tag_version do
  tag_to_set = ENV['GIT_TAG_TO_SET']

  puts "GIT_TAG_TO_SET is #{tag_to_set}"

  if tag_to_set.nil? || tag_to_set.length.zero?
    tag_to_set = get_semver_from_branch(ENV['GIT_HEAD_REF'],
                                        with_meta: true)
  end

  UI.user_error! 'unable to determine git tag to set' if tag_to_set.nil? || tag_to_set.length.zero?

  puts "tagging current as \"#{tag_to_set}\""

  if git_tag_exists(tag: tag_to_set)
    UI.important 'warning: tag already exists and will be overwritten! see output below:'
    sh "git rev-list -n 1 \"tags/#{tag_to_set}\""
  end

  add_git_tag(
    tag: tag_to_set,
    message: "(automatic release tag)\n\n#{changelog}",
    force: true
  )
  push_git_tags(force: true)
end

before_all do |_lane, _options|
  puts "branch: #{git_branch}"
  puts "CI_MATCHED_ENV: #{ENV['CI_MATCHED_ENV']}"
  puts "FORCED_VERSION_NUMBER_STRING: #{ENV['FORCED_VERSION_NUMBER_STRING']}"
  puts "FORCED_BUILD_NUMBER: #{ENV['FORCED_BUILD_NUMBER']}"
  puts "GIT_HEAD_REF: #{ENV['GIT_HEAD_REF']}"
  puts "GYM_SCHEME: #{ENV['GYM_SCHEME']}"
  puts "MAIN_PROJECT: #{ENV['MAIN_PROJECT']}"
  puts "MAIN_WORKSPACE: #{ENV['MAIN_WORKSPACE']}"
  puts "PERFORM_LONG_UPLOAD: #{ENV['PERFORM_LONG_UPLOAD']}"
  puts "GIT_TAG_TO_SET: #{ENV['GIT_TAG_TO_SET']}"
end
