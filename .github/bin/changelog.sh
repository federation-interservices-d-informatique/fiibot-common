#!/usr/bin/env bash
red() {
	echo -e "\e[91m$@\e[m"
}
main(){
	declare -A changelog
	TAG="${1}"
	if [[ -z "${1}" ]]
	then
		TAG="$(git tag | tail -n 2 | head -n 1)" # Get the second last tag name
	fi
	git show "${TAG}" 2> /dev/null &> /dev/null || {
		red "Invalid tag: ${TAG}"
		exit 1
	}
	COMMITS="$(git log --pretty --format="%h" ${TAG}..HEAD)"
	for COMMIT in $COMMITS
	do
		COMMIT_DESC="$(git log --pretty --format="%s" -n 1 ${COMMIT})" # Get the description of the commit (NOTE: the -n1 option is required)
		if [[ $COMMIT_DESC =~ ^Merge* ]] || [[ $COMMIT_DESC =~ ^Project* ]] || [[ $COMMIT_DESC =~ ^Version:* ]]
		then
			continue; # We need to ignore merge commits and dependabot commits
		fi
		COMMIT_TYPE="$(echo $COMMIT_DESC | awk -F ': ' '{ print $1 }')"
		COMMIT_INFO="$(echo $COMMIT_DESC | awk -F ': ' '{ print $2 }')"
		changelog[$COMMIT_TYPE]+="- [${COMMIT}](https://github.com/${GITHUB_REPOSITORY}/commit/${COMMIT}): ${COMMIT_INFO}\n"
	done
	for ctype in "${!changelog[@]}"
	do
		OK_COMMITS="${changelog[$ctype]}"
		echo -e "## ${ctype}\n"
		for COMMIT in "${OK_COMMITS}"
		do
			echo -e "${COMMIT}"
		done
	done
}
main $@
